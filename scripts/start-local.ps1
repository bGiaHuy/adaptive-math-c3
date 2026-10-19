$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$logRoot = Join-Path $projectRoot '.cache/local-web'
New-Item -ItemType Directory -Force -Path $logRoot | Out-Null
$nodeExecutable = (Get-Command node -ErrorAction Stop).Source

function Test-LocalHttp([string]$url) {
    try { return (Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 2).StatusCode -eq 200 } catch { return $false }
}

function Test-LocalDatabasePort {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $connection = $client.ConnectAsync('127.0.0.1', 5432)
        return $connection.Wait(1000) -and $client.Connected
    } catch { return $false } finally { $client.Dispose() }
}

if (!(Test-LocalHttp 'http://127.0.0.1:4017/api/v1/health')) {
    if (!(Test-LocalDatabasePort)) {
        $databaseRoot = Join-Path $projectRoot 'apps/api/.embedded-test-db'
        if (!(Test-Path (Join-Path $databaseRoot 'PG_VERSION'))) { throw 'Existing local database not found. No new database was created.' }
        $postgresExecutable = Join-Path $projectRoot 'node_modules/@embedded-postgres/windows-x64/native/bin/postgres.exe'
        Start-Process -FilePath $postgresExecutable -WorkingDirectory $projectRoot -ArgumentList @('-D', ('"' + $databaseRoot + '"'), '-p', '5432') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logRoot 'postgres.log') -RedirectStandardError (Join-Path $logRoot 'postgres-error.log') | Out-Null
        for ($i = 0; $i -lt 20; $i++) {
            if (Test-LocalDatabasePort) { break }
            Start-Sleep -Milliseconds 500
        }
        if (!(Test-LocalDatabasePort)) { throw 'Existing local database could not start. Inspect .cache/local-web/postgres-error.log.' }
    }
    if (!(Test-Path (Join-Path $projectRoot 'apps/api/dist/main.js'))) { throw 'Build the API before starting the local site.' }
    $env:WEB_ALLOWED_ORIGINS = 'http://127.0.0.1:3027,http://localhost:3027,http://127.0.0.1:3017'
    Start-Process -FilePath $nodeExecutable -WorkingDirectory (Join-Path $projectRoot 'apps/api') -ArgumentList 'dist/main.js' -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logRoot 'api.log') -RedirectStandardError (Join-Path $logRoot 'api-error.log') | Out-Null
}

if (!(Test-LocalHttp 'http://127.0.0.1:3027/')) {
    Start-Process -FilePath $nodeExecutable -WorkingDirectory $projectRoot -ArgumentList @('node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '3027') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logRoot 'web.log') -RedirectStandardError (Join-Path $logRoot 'web-error.log') | Out-Null
}

for ($i = 0; $i -lt 20; $i++) {
    if ((Test-LocalHttp 'http://127.0.0.1:3027/') -and (Test-LocalHttp 'http://127.0.0.1:3027/api/v1/health')) {
        Write-Output 'Local website and database are ready: http://127.0.0.1:3027/#/teacher-bank'
        exit 0
    }
    Start-Sleep -Milliseconds 500
}
throw 'Local website did not become healthy. Inspect .cache/local-web/ logs.'

