const { default: EmbeddedPostgres } = require('embedded-postgres');
const path = require('path');
const fs = require('fs');

async function main() {
  const dataDir = path.join(__dirname, '.embedded-test-db');
  if (fs.existsSync(dataDir)) {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }

  const pg = new EmbeddedPostgres({
    port: 5432,
    databaseDir: dataDir,
    user: 'am',
    password: 'am_dev_password',
    database: 'adaptivemath_test',
    persistent: true
  });

  console.log('Initialising DB...');
  await pg.initialise();
  console.log('Starting DB...');
  await pg.start();
  console.log('PostgreSQL 18.4 is RUNNING on port 5432!');

  const { Client } = require('pg');
  const client = new Client({
    connectionString: 'postgresql://am:am_dev_password@localhost:5432/adaptivemath_test'
  });
  await client.connect();
  const res = await client.query('SELECT 1 as num, version()');
  console.log('Connected query result:', res.rows[0]);
  await client.end();
  console.log('Test completed successfully!');
}

main().catch(err => {
  console.error('Failure:', err);
  process.exit(1);
});
