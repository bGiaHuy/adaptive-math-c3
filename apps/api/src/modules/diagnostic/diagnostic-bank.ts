import { sharedThptDraftWhere } from '../curriculum/thpt-catalog';
import { THPT_DIAGNOSTIC_BLUEPRINT_VERSION } from '../question/diagnostic-blueprint';

// AI supplements are private to this student; they never become VERIFIED or shared.
export const diagnosticBankWhere = (studentId: string) => ({ OR: [
  { status: 'PUBLISHED' as const },
  { status: 'DRAFT' as const, source: { path: ['reviewStatus'], equals: 'VERIFIED' } },
  sharedThptDraftWhere(),
  { status: 'DRAFT' as const, authorId: studentId, AND: [
    { source: { path: ['reviewStatus'], equals: 'AI_DIAGNOSTIC_CHECKED' } },
    { source: { path: ['studentId'], equals: studentId } },
    { source: { path: ['blueprintVersion'], equals: THPT_DIAGNOSTIC_BLUEPRINT_VERSION } }
  ] }
] });
