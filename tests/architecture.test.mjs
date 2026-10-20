import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const checker = fileURLToPath(new URL('../scripts/architecture/check.mjs', import.meta.url));
// Mỗi cặp tạo một kho tạm riêng và chạy đúng CLI được dùng trong CI.
const pairs = [
  {
    rule: 'workspace-public',
    file: 'src/main.js',
    valid: "import '@adaptivemath/contracts/curriculum.js';",
    invalid: "import '@adaptivemath/api/private';",
  },
  {
    rule: 'browser-server',
    file: 'src/main.js',
    valid: "import './lib/value.js';",
    invalid: "import '../apps/api/src/main';",
  },
  {
    rule: 'server-browser',
    file: 'apps/api/src/main.ts',
    valid: "import './common/value';",
    invalid: "import '../../../src/lib/value.js';",
  },
  {
    rule: 'contracts-pure',
    file: 'packages/contracts/value.ts',
    valid: 'export const value = 1;',
    invalid: "import React from 'react';",
  },
  {
    rule: 'domain-pure',
    file: 'apps/api/src/common/domain/value.ts',
    valid: 'export const double = n => n * 2;',
    invalid: "import fs from 'node:fs';",
  },
  {
    rule: 'foundation-direction',
    file: 'apps/api/src/common/value.ts',
    valid: 'export const value = 1;',
    invalid: "import '../modules/auth/auth.service';",
  },
  {
    rule: 'frontend-foundation',
    file: 'src/lib/new.js',
    valid: "import './value.js';",
    invalid: "import '../components/View.jsx';",
  },
  {
    rule: 'feature-isolation',
    file: 'src/features/teacher/index.js',
    valid: "import './private.js';",
    invalid: "import '../student/index.js';",
  },
  {
    rule: 'feature-public',
    file: 'src/main.js',
    valid: "import './features/teacher/index.js';",
    invalid: "import './features/teacher/private.js';",
  },
  {
    rule: 'module-dependency',
    file: 'apps/api/src/modules/assignment/value.ts',
    valid: "import '../question/math-question';",
    invalid: "import '../student/private';",
  },
  {
    rule: 'module-public',
    file: 'apps/api/src/modules/assignment/value.ts',
    valid: "import '../auth/guards/auth.guard';",
    invalid: "import '../auth/auth.service';",
  },
  {
    rule: 'module-dependency',
    file: 'apps/api/src/modules/diagnostic/value.ts',
    valid: "import '../ai/ai-budget.service';",
    invalid: "import '../student/private';",
  },
  {
    rule: 'module-public',
    file: 'apps/api/src/modules/diagnostic/value.ts',
    valid: "import '../ai/ai.config';",
    invalid: "import '../ai/private';",
  },
  {
    rule: 'module-registration',
    file: 'apps/api/src/modules/new-feature/value.ts',
    valid: '',
    invalid: 'export const value = 1;',
    emptyValid: true,
  },
  {
    rule: 'resolve-import',
    file: 'src/main.js',
    valid: "export { value } from './lib/value.js';",
    invalid: "export { value } from './missing.js';",
  },
  {
    rule: 'source-scope',
    file: 'src/main.js',
    valid: "import './lib/value.js';",
    invalid: "import '../outside.js';",
  },
  {
    rule: 'static-import',
    file: 'src/main.js',
    valid: "import('./lib/value.js');",
    invalid: "const target = './lib/value.js'; import(target);",
  },
  {
    rule: 'cycle',
    file: 'src/lib/value.js',
    valid: 'export const value = 1;',
    invalid: "export { value } from './loop.js';",
  },
];
const support = {
  'src/lib/value.js': 'export const value = 1;',
  'src/lib/loop.js': "export { value } from './value.js';",
  'src/features/teacher/index.js': 'export const value = 1;',
  'src/features/teacher/private.js': 'export const value = 1;',
  'src/features/student/index.js': 'export const value = 1;',
  'src/components/View.jsx': 'export const View = () => <div />;',
  'apps/api/src/main.ts': 'export const value = 1;',
  'apps/api/src/common/value.ts': 'export const value = 1;',
  'apps/api/src/modules/question/math-question.ts': 'export const value = 1;',
  'apps/api/src/modules/student/private.ts': 'export const value = 1;',
  'apps/api/src/modules/auth/guards/auth.guard.ts': 'export class AuthGuard {}',
  'apps/api/src/modules/auth/auth.service.ts': 'export class AuthService {}',
  'apps/api/src/modules/ai/ai-budget.service.ts': 'export class AiBudgetService {}',
  'apps/api/src/modules/ai/ai.config.ts': 'export const value = 1;',
  'apps/api/src/modules/ai/private.ts': 'export const value = 1;',
  'outside.js': 'export const value = 1;',
  'packages/contracts/curriculum.js': 'exports.value = 1;',
};

for (const pair of pairs) {
  test(`Kiến trúc ${pair.rule}: ví dụ đúng đạt, ví dụ sai bị CLI từ chối`, () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'math-c3-architecture-'));
    try {
      for (const [name, text] of Object.entries(support)) {
        fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
        fs.writeFileSync(path.join(root, name), text);
      }
      const target = path.join(root, pair.file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      if (!pair.emptyValid) fs.writeFileSync(target, pair.valid);
      let result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr + result.stdout);
      fs.writeFileSync(target, pair.invalid);
      result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
      assert.equal(result.status, 1, result.stderr + result.stdout);
      assert.ok(result.stderr.includes(`[${pair.rule}]`), result.stderr);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
    assert.equal(fs.existsSync(root), false);
  });
}

for (const [label, invalid] of [
  ['cú pháp', 'export const value = ;'],
  ['debugger', 'debugger;'],
  ['conflict', '// Nội dung\n<<<<<<< HEAD\nexport const value = 1;'],
]) {
  test(`Lint từ chối ${label} và chấp nhận mã hợp lệ`, () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'math-c3-lint-'));
    const lint = fileURLToPath(new URL('../scripts/architecture/lint.mjs', import.meta.url));
    try {
      fs.mkdirSync(path.join(root, 'src'));
      const target = path.join(root, 'src/main.js');
      fs.writeFileSync(target, 'export const value = 1;');
      assert.equal(spawnSync(process.execPath, [lint], { cwd: root }).status, 0);
      fs.writeFileSync(target, invalid);
      assert.equal(spawnSync(process.execPath, [lint], { cwd: root }).status, 1);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
    assert.equal(fs.existsSync(root), false);
  });
}

test('Kiểm tra cả require, import type, import equals, export và chuỗi escape', async () => {
  const { importsOf } = await import('../scripts/architecture/check.mjs');
  const source =
    "import type { X } from './types'; import x = require('./x'); export * from './public'; require('./r'); import('./d'); import './\\u0061'; type T = import('./type-expression').T;";
  assert.deepEqual(
    importsOf('sample.ts', source).imports.map((entry) => entry.specifier),
    ['./types', './x', './public', './r', './d', './a', './type-expression'],
  );
});
