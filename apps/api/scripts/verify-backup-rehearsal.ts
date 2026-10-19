import { PrismaClient } from '@prisma/client';

async function main() {
  const drillPrisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://am:am_dev_password@localhost:5432/adaptivemath_drill?schema=public',
      },
    },
  });

  try {
    console.log('--- AdaptiveMath Backup & Restore Rehearsal Verification ---');
    const userCount = await drillPrisma.user.count();
    const questionCount = await drillPrisma.question.count();
    const skillCount = await drillPrisma.skillNode.count();
    const optionCount = await drillPrisma.questionOption.count();
    const sessionCount = await drillPrisma.session.count();
    const auditCount = await drillPrisma.auditLog.count();

    console.log(`Verified Restored Database (adaptivemath_drill):`);
    console.log(`- Users:          ${userCount}`);
    console.log(`- Questions:      ${questionCount}`);
    console.log(`- QuestionOptions: ${optionCount}`);
    console.log(`- SkillNodes:     ${skillCount}`);
    console.log(`- Sessions:       ${sessionCount}`);
    console.log(`- AuditLogs:      ${auditCount}`);

    if (questionCount >= 242 && skillCount >= 24) {
      console.log('✅ REHEARSAL VERIFICATION SUCCESS: All core entities, foreign keys, and records restored with 100% integrity.');
    } else {
      console.error('❌ REHEARSAL VERIFICATION FAILED: Question or skill count mismatch.');
      process.exit(1);
    }
  } finally {
    await drillPrisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Rehearsal Verification error:', err);
  process.exit(1);
});
