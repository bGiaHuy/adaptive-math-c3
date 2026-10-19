import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { hash } from '@node-rs/argon2';
import { blueprintSkills, blueprintQuestions } from '../test/fixtures/blueprint';
import { buildQuestionData } from '../src/modules/question/math-question';
const url = new URL(process.env.DATABASE_URL || '');
if (process.env.NODE_ENV !== 'test' || !['127.0.0.1','localhost'].includes(url.hostname)) throw new Error('Audit fixture requires an isolated loopback test database.');
const db = new PrismaClient();
async function main() {
 const admin = await db.user.create({data:{username:'admin',email:'isolated-admin@test.adaptivemath.local',fullName:'Isolated audit admin',passwordHash:await hash('P@ssword123!'),role:'ADMIN'}});
 for(const skill of blueprintSkills)await db.skillNode.create({data:skill});
 for(const q of blueprintQuestions())await db.question.create({data:{skillId:q.skillId,authorId:admin.id,cognitiveLevel:q.cognitiveLevel,difficulty:q.difficulty,content:q.content,explanation:q.explanation,status:'PUBLISHED',...buildQuestionData(q)}});
 console.log('Seeded isolated admin and 22-question blueprint fixture; production is never used.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.$disconnect());
