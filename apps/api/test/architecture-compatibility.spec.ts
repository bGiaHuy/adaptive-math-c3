import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import * as legacyAdaptive from '../src/modules/student/math-adaptive';
import * as adaptive from '../src/common/domain/math-adaptive';
import * as legacyBlueprint from '../src/modules/diagnostic/diagnostic-blueprint';
import * as blueprint from '../src/modules/question/diagnostic-blueprint';
import * as serverCatalog from '../src/modules/curriculum/thpt-catalog';
import * as sharedCatalog from '@adaptivemath/contracts/curriculum.js';

describe('Tương thích giao diện sau khi chuyển quyền sở hữu', () => {
  it('giữ nguyên tất cả export và identity của thuật toán', () => {
    expect(Object.keys(legacyAdaptive).sort()).toEqual(Object.keys(adaptive).sort());
    for (const key of Object.keys(adaptive)) expect(legacyAdaptive[key]).toBe(adaptive[key]);
  });
  it('giữ nguyên tất cả export và identity của ma trận đề', () => {
    expect(Object.keys(legacyBlueprint).sort()).toEqual(Object.keys(blueprint).sort());
    for (const key of Object.keys(blueprint)) expect(legacyBlueprint[key]).toBe(blueprint[key]);
  });
  it('server dùng cùng danh mục, ID và trạng thái ngân hàng với contracts', () => {
    expect(serverCatalog.THPT_CURRICULUM).toBe(sharedCatalog.THPT_CURRICULUM);
    expect(serverCatalog.LEGACY_BANK_PAUSED).toBe(true);
    expect(
      serverCatalog.THPT_CURRICULUM.map((level) => [level.grade, level.chapters.length]),
    ).toEqual([
      [10, 9],
      [11, 9],
      [12, 6],
    ]);
    expect(serverCatalog.THPT_CURRICULUM[0].chapters[0].topics[0].id).toBe('KNTT-10-C01-T01');
    expect(
      createHash('sha256')
        .update(
          JSON.stringify([
            serverCatalog.LEGACY_BANK_PAUSED,
            serverCatalog.THPT_BOOK,
            serverCatalog.THPT_CURRICULUM,
          ]),
        )
        .digest('hex'),
    ).toBe('047b598b3257617760d49e801dd242d6520aa1faf4329d4aa3d66c6f26f6a6d1');
  });
});
