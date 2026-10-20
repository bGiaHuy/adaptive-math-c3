// Giao diện liên module được cho phép; thêm cạnh mới cần ADR và kiểm thử.
export const publicFiles = {
  auth: [
    'auth.module.ts',
    'guards/auth.guard.ts',
    'guards/roles.guard.ts',
    'decorators/current-user.decorator.ts',
    'decorators/roles.decorator.ts',
    'session-cookie.ts',
  ],
  prisma: ['prisma.module.ts', 'prisma.service.ts'],
  question: [
    'math-question.ts',
    'typed-question.dto.ts',
    'question-labels.ts',
    'question-label-rubric.ts',
    'diagnostic-blueprint.ts',
  ],
  curriculum: ['thpt-catalog.ts'],
  ai: ['ai-budget.service.ts', 'ai.config.ts'],
};
export const dependencies = {
  admin: ['auth', 'prisma', 'question', 'curriculum'],
  assignment: ['auth', 'prisma', 'question', 'curriculum', 'ai'],
  auth: ['prisma'],
  classroom: ['auth', 'prisma'],
  curriculum: ['auth', 'prisma'],
  diagnostic: ['auth', 'prisma', 'question', 'curriculum', 'ai'],
  english: ['auth', 'prisma'],
  health: ['prisma'],
  student: ['auth', 'prisma', 'question', 'curriculum', 'ai'],
  ai: ['prisma'],
  prisma: [],
  question: [],
};
