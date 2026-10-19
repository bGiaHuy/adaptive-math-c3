import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient, UserRole } from '@prisma/client';
import { EnglishService } from '../src/modules/english/english.service';

const file = resolve(process.argv[2] || '../../content/english/batch_001.json');
const batch = JSON.parse(readFileSync(file, 'utf8'));
const prisma = new PrismaClient();

async function main() {
  const service = new EnglishService(prisma as any);
  const result = await service.importBatch(batch, UserRole.ADMIN);
  console.log(`Imported ${batch.batchId || file}: ${result.topics} topics, ${result.lessons} lessons, ${result.exercises} exercises.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => prisma.$disconnect());
