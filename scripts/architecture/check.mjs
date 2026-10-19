import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { builtinModules } from 'node:module';
import ts from 'typescript';
import { dependencies, publicFiles } from './policy.mjs';

export const sourceRoots = ['src', 'apps/api/src', 'packages/contracts'];
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
const normalize = (value) => value.split(path.sep).join('/');
export function sourceFiles(root) {
  const files = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && !['dist', 'node_modules'].includes(entry.name)) walk(full);
      else if (extensions.includes(path.extname(full))) files.push(full);
    }
  };
  sourceRoots.forEach((dir) => walk(path.join(root, dir)));
  return files.sort();
}

export function importsOf(file, text) {
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const imports = [];
  const visit = (node) => {
    let argument;
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument))
      argument = node.argument.literal;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
      argument = node.moduleSpecifier;
    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference))
      argument = node.moduleReference.expression;
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === 'require'))
    ) {
      argument = node.arguments[0];
      if (!argument || !ts.isStringLiteralLike(argument))
        imports.push({
          specifier: null,
          line: ast.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        });
    }
    if (argument && ts.isStringLiteralLike(argument))
      imports.push({
        specifier: argument.text,
        line: ast.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return { ast, imports };
}

function resolveLocal(root, from, specifier) {
  if (specifier === '@adaptivemath/contracts')
    return path.join(root, 'packages/contracts/src/index.ts');
  if (specifier === '@adaptivemath/contracts/curriculum.js')
    return path.join(root, 'packages/contracts/curriculum.js');
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(from), specifier);
  const candidates = [
    base,
    ...extensions.map((ext) => base + ext),
    ...extensions.map((ext) => path.join(base, 'index' + ext)),
  ];
  if (/\.js$/.test(base)) candidates.push(base.slice(0, -3) + '.ts');
  return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile()) || false;
}
const apiModule = (file) => /^apps\/api\/src\/modules\/([^/]+)\/(.+)$/.exec(file);
const feature = (file) => /^src\/features\/([^/]+)\/(.+)$/.exec(file);
const builtins = new Set(builtinModules.flatMap((name) => [name, `node:${name}`]));

export function checkArchitecture(root) {
  const files = sourceFiles(root);
  const names = new Set(files.map((file) => normalize(path.relative(root, file))));
  const graph = new Map([...names].map((name) => [name, []]));
  const errors = [];
  const fail = (rule, file, line, detail) => errors.push({ rule, file, line, detail });
  for (const file of files) {
    const name = normalize(path.relative(root, file));
    const owner = apiModule(name);
    if (owner && !(owner[1] in dependencies)) fail('module-registration', name, 1, owner[1]);
    for (const { specifier, line } of importsOf(file, fs.readFileSync(file, 'utf8')).imports) {
      if (specifier === null) {
        fail('static-import', name, line, 'Import động phải dùng chuỗi literal');
        continue;
      }
      if (
        specifier.startsWith('@adaptivemath/') &&
        !['@adaptivemath/contracts', '@adaptivemath/contracts/curriculum.js'].includes(specifier)
      )
        fail('workspace-public', name, line, specifier);
      const target = resolveLocal(root, file, specifier);
      const targetName = target ? normalize(path.relative(root, target)) : null;
      if (target === false) fail('resolve-import', name, line, specifier);
      if (
        targetName &&
        !names.has(targetName) &&
        !/\.(css|json|svg|png|jpe?g|webp)$/.test(targetName)
      )
        fail('source-scope', name, line, targetName);
      if (targetName && names.has(targetName)) graph.get(name).push(targetName);
      if (
        name.startsWith('src/') &&
        ((targetName &&
          !targetName.startsWith('src/') &&
          !targetName.startsWith('packages/contracts/')) ||
          /^(?:@nestjs\/|@prisma\/|@adaptivemath\/api|node:)/.test(specifier) ||
          builtins.has(specifier))
      )
        fail('browser-server', name, line, specifier);
      if (name.startsWith('apps/api/src/') && targetName?.startsWith('src/'))
        fail('server-browser', name, line, specifier);
      if (
        name.startsWith('packages/contracts/') &&
        ((!targetName?.startsWith('packages/contracts/') && targetName !== null) ||
          !specifier.startsWith('.'))
      )
        fail('contracts-pure', name, line, specifier);
      if (
        name.startsWith('apps/api/src/common/domain/') &&
        !targetName?.startsWith('apps/api/src/common/domain/')
      )
        fail('domain-pure', name, line, specifier);
      if (/^apps\/api\/src\/(common|config)\//.test(name) && targetName?.includes('/modules/'))
        fail('foundation-direction', name, line, specifier);
      if (
        /^src\/(lib|data|shared)\//.test(name) &&
        /^src\/(components|features)\//.test(targetName || '')
      )
        fail('frontend-foundation', name, line, specifier);
      const fromFeature = feature(name),
        toFeature = feature(targetName || '');
      if (fromFeature && toFeature && fromFeature[1] !== toFeature[1])
        fail('feature-isolation', name, line, specifier);
      if (!fromFeature && toFeature && !/^index\.[jt]sx?$/.test(toFeature[2]))
        fail('feature-public', name, line, specifier);
      const to = apiModule(targetName || '');
      if (owner && to && owner[1] !== to[1]) {
        if (!dependencies[owner[1]]?.includes(to[1]))
          fail('module-dependency', name, line, `${owner[1]} -> ${to[1]}`);
        if (!publicFiles[to[1]]?.includes(to[2])) fail('module-public', name, line, targetName);
      }
    }
  }
  const visited = new Set(),
    active = new Set(),
    stack = [];
  const visit = (name) => {
    if (active.has(name)) {
      fail('cycle', name, 1, [...stack.slice(stack.indexOf(name)), name].join(' -> '));
      return;
    }
    if (visited.has(name)) return;
    active.add(name);
    stack.push(name);
    for (const target of graph.get(name)) visit(target);
    stack.pop();
    active.delete(name);
    visited.add(name);
  };
  [...graph.keys()].forEach(visit);
  return { files: files.length, errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkArchitecture(process.cwd());
  for (const error of result.errors)
    console.error(`${error.file}:${error.line} [${error.rule}] ${error.detail}`);
  console.log(`${result.files} tệp; ${result.errors.length} vi phạm kiến trúc.`);
  process.exitCode = result.errors.length ? 1 : 0;
}
