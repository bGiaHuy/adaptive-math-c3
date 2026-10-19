import fs from 'node:fs';
import ts from 'typescript';
import { importsOf, sourceFiles } from './check.mjs';

let errors = 0;
for (const file of sourceFiles(process.cwd())) {
  const text = fs.readFileSync(file, 'utf8');
  const { ast } = importsOf(file, text);
  const report = (position, message) => {
    console.error(`${file}:${ast.getLineAndCharacterOfPosition(position).line + 1} ${message}`);
    errors++;
  };
  for (const diagnostic of ast.parseDiagnostics)
    report(diagnostic.start || 0, ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
  const visit = (node) => {
    if (node.kind === ts.SyntaxKind.DebuggerStatement)
      report(node.getStart(), 'Không để debugger trong mã sản phẩm.');
    ts.forEachChild(node, visit);
  };
  visit(ast);
  if (/^(<{7}|={7}|>{7})(?: |$)/m.test(text)) report(0, 'Còn dấu conflict merge.');
}
console.log(`${errors} lỗi lint cú pháp/quy ước.`);
process.exitCode = errors ? 1 : 0;
