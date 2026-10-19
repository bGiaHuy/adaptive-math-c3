import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const extensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.css', '.map', '.md', '.yml', '.yaml']);
const findings = [];
function scan(folder) {
  if (!fs.existsSync(folder)) return;
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'test', 'prisma', '.git', '.vercel'].includes(entry.name)) scan(file);
    } else if (extensions.has(path.extname(file))) {
      const content = fs.readFileSync(file, 'utf8');
      if (/sk-(?:ant-)?[A-Za-z0-9_-]{20,}/.test(content)) findings.push(`${path.relative(root, file)}: possible provider key`);
      if (file.startsWith(path.join(root, 'src')) && /import\.meta\.env\s*(?:\.VITE_[A-Z_]*(?:KEY|SECRET|TOKEN)|\[['"]VITE_[A-Z_]*(?:KEY|SECRET|TOKEN)['"]\])/.test(content)) {
        findings.push(`${path.relative(root, file)}: browser secret configuration`);
      }
    }
  }
}
for (const folder of ['src', 'apps/api/src', 'public', 'dist', 'scripts', 'docs']) scan(path.join(root, folder));
if (findings.length) { console.error(findings.join('\n')); process.exitCode = 1; }
else console.log('No Claude keys or browser secret configuration found in scanned source and frontend build.');
