import { PrismaClient } from '@prisma/client';
import { embed } from '../src/rag/embed';

const prisma = new PrismaClient();

async function seed() {
  await prisma.chunk.deleteMany();
  await prisma.document.deleteMany();
  const docs = [
    { title: 'Acme kickoff', sourceType: 'meeting_note', author: 'Alice',
      rawText: 'Acme meeting: discussed lead investor Globex and follow-on from Initech. Globex confirmed participation in the Series A.' },
    { title: 'Northwind CRM', sourceType: 'crm_record', author: 'Bob',
      rawText: 'Northwind partnered with Initech on the distribution deal. Initech is the counterparty for Q3.' },
    { title: 'Q3 Report', sourceType: 'report', author: 'Carol',
      rawText: 'Q3 report shows revenue up 18% quarter over quarter. Globex remains the largest external stakeholder.' },
  ];
  for (const d of docs) {
    const doc = await prisma.document.create({ data: d });
    const words = d.rawText.split(/\s+/);
    for (let i = 0; i < words.length; i += 240) {
      const text = words.slice(i, i + 240).join(' ');
      await prisma.chunk.create({
        data: { docId: doc.id, text, embedding: JSON.stringify(embed(text)),
          sourceType: d.sourceType, author: d.author,
          entity: /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/.exec(text)?.[1] ?? null },
      });
    }
  }
  console.log('seeded', docs.length, 'documents');
}
seed().finally(() => prisma.$disconnect());
