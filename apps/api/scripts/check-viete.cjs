const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.question.findMany({
  where: {
    OR: [
      { content: { contains: 'Vi' } },
      { content: { contains: 'x_1' } },
      { content: { contains: 'x1' } },
      { content: { contains: 'nghiem' } },
      { content: { contains: 'nghiệm' } },
      { content: { contains: 'phuong trinh' } },
      { content: { contains: 'phương trình' } }
    ]
  },
  include: { options: true, skill: { select: { code: true, title: true } } },
  take: 20
}).then(qs => {
  qs.forEach(q => {
    console.log('---');
    console.log('SKILL:', q.skill?.code, '-', q.skill?.title);
    console.log('CONTENT:', q.content);
    q.options.forEach(o => console.log('  OPT:', o.label, '|', o.content));
  });
  return p.$disconnect();
}).catch(e => { console.error(e); p.$disconnect(); });
