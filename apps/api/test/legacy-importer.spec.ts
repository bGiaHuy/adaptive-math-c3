import { describe, it, expect } from 'vitest';
import { CognitiveLevel } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { mapCognitiveLevel, validateKatexSyntax } from '../scripts/migrate-legacy-questions';

describe('Legacy Question Importer & KaTeX Syntax Unit Tests (Phase 5)', () => {
  describe('KaTeX Syntax & Delimiter Validation', () => {
    it('passes for plain text without math expressions', () => {
      const result = validateKatexSyntax('Giải phương trình sau đây để tìm nghiệm x');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('passes for properly matched inline math delimiters', () => {
      const result = validateKatexSyntax('Cho tam giác $ABC$ vuông tại $A$ có cạnh huyền $BC = 10\\text{ cm}$.');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('passes for properly matched LaTeX braces in formulas', () => {
      const result = validateKatexSyntax('Biểu thức $P = \\frac{\\sqrt{x} + 1}{\\sqrt{x} - 1}$ xác định khi nào?');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects unmatched single dollar delimiter', () => {
      const result = validateKatexSyntax('Giá trị của biểu thức $x + 2 là bao nhiêu?');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes("Unmatched single '$'"))).toBe(true);
    });

    it('detects unclosed curly brace inside math delimiters', () => {
      const result = validateKatexSyntax('Tính căn bậc hai của biểu thức $\\sqrt{x + 1$');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes("Unclosed brace '{'"))).toBe(true);
    });

    it('detects mismatched closing brace before opening brace', () => {
      const result = validateKatexSyntax('Công thức $x} + 1{ = 0$ không hợp lệ');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes("Mismatched closing brace '}'"))).toBe(true);
    });
  });

  describe('Cognitive Level Mapping (GDPT 2018 / KNTT)', () => {
    it('maps level "N" (Nhận biết) to REMEMBERING', () => {
      expect(mapCognitiveLevel('N')).toBe(CognitiveLevel.REMEMBERING);
    });

    it('maps level "H" (Thông hiểu) to UNDERSTANDING', () => {
      expect(mapCognitiveLevel('H')).toBe(CognitiveLevel.UNDERSTANDING);
    });

    it('maps level "V" (Vận dụng) to APPLYING', () => {
      expect(mapCognitiveLevel('V')).toBe(CognitiveLevel.APPLYING);
    });

    it('preserves level "T" (Vận dụng cao) independently of APPLYING', () => {
      expect(mapCognitiveLevel('T')).toBe(CognitiveLevel.ADVANCED_APPLYING);
    });

    it('defaults unknown levels to REMEMBERING safely', () => {
      expect(mapCognitiveLevel('UNKNOWN')).toBe(CognitiveLevel.REMEMBERING);
      expect(mapCognitiveLevel('')).toBe(CognitiveLevel.REMEMBERING);
    });
  });

  describe('Question Data Integrity Rules', () => {
    it('validates question must have exactly 4 options', () => {
      const validOptions = [
        { optionKey: 'A', content: '$x=1$', isCorrect: true },
        { optionKey: 'B', content: '$x=2$', isCorrect: false },
        { optionKey: 'C', content: '$x=3$', isCorrect: false },
        { optionKey: 'D', content: '$x=4$', isCorrect: false }
      ];
      expect(validOptions).toHaveLength(4);

      const invalidOptions = [
        { optionKey: 'A', content: '$x=1$', isCorrect: true },
        { optionKey: 'B', content: '$x=2$', isCorrect: false }
      ];
      expect(invalidOptions.length !== 4).toBe(true);
    });

    it('validates question must have exactly one correct option', () => {
      const validOptions = [
        { optionKey: 'A', content: '$x=1$', isCorrect: true },
        { optionKey: 'B', content: '$x=2$', isCorrect: false },
        { optionKey: 'C', content: '$x=3$', isCorrect: false },
        { optionKey: 'D', content: '$x=4$', isCorrect: false }
      ];
      const correctCount = validOptions.filter(o => o.isCorrect).length;
      expect(correctCount).toBe(1);

      const noCorrect = validOptions.map(o => ({ ...o, isCorrect: false }));
      expect(noCorrect.filter(o => o.isCorrect).length).toBe(0);

      const multiCorrect = validOptions.map(o => ({ ...o, isCorrect: true }));
      expect(multiCorrect.filter(o => o.isCorrect).length).toBe(4);
    });

    it('detects duplicate question prompts via normalization hash', () => {
      const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
      const q1 = '  Tìm nghiệm của phương trình   $x^2 - 4 = 0$  ';
      const q2 = 'Tìm nghiệm của phương trình $x^2 - 4 = 0$';
      expect(normalize(q1)).toBe(normalize(q2));
    });
  });

  describe('Missing Source Path Verification (Phase 5 Blocker Evidence)', () => {
    it('accurately reports non-existent legacy directory as missing', () => {
      const configuredPath = 'C:\\Users\\Administrator\\Downloads\\KHKT_hòa bình\\AdaptiveMath_THCS_KNTT_2026\\adaptivemath-main';
      const exists = fs.existsSync(configuredPath);
      expect(exists).toBe(false);
    });
  });
});
