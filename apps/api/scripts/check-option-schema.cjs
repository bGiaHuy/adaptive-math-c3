const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// Show full option object to check which fields exist
p.questionOption.findFirst().then(opt => {
  console.log('Option fields:', JSON.stringify(opt, null, 2));
  return p.$disconnect();
});
