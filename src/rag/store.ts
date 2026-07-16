import { PrismaClient, Prisma } from '@prisma/client';
import { embed, cosine } from './embed';

const prisma = new PrismaClient();

export interface RetrievedChunk {
  id: number;
  docId: number;
  text: string;
  sourceType: string;
  entity: string | null;
  author: string | null;
  score: number;
}

/**
 * Local retrieve: cosine over stored embeddings with metadata filtering.
 * Mirrors ragpilot.store.retrieve — same contract, TS implementation.
 */
export async function retrieve(
  question: string,
  opts: { sourceTypes?: string[]; entity?: string; topK?: number } = {},
): Promise<RetrievedChunk[]> {
  const topK = opts.topK ?? 5;
  const q = embed(question);
  const chunks = await prisma.chunk.findMany();
  const scored = chunks
    .filter((c) => !opts.sourceTypes || opts.sourceTypes.includes(c.sourceType))
    .filter((c) => !opts.entity || c.entity?.toLowerCase() === opts.entity.toLowerCase())
    .map((c) => ({
      id: c.id,
      docId: c.docId,
      text: c.text,
      sourceType: c.sourceType,
      entity: c.entity,
      author: c.author,
      score: cosine(q, JSON.parse(c.embedding as unknown as string) as number[]),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/** Ingest a document: chunk + embed + persist (mirrors ragpilot.ingest). */
export async function ingestDocument(input: {
  title: string;
  rawText: string;
  sourceType?: string;
  author?: string;
}): Promise<{ docId: number; chunks: number }> {
  const doc = await prisma.document.create({
    data: {
      title: input.title,
      rawText: input.rawText,
      sourceType: input.sourceType ?? 'meeting_note',
      author: input.author,
    },
  });
  const words = input.rawText.split(/\s+/);
  const size = 240;
  const chunks: number[] = [];
  for (let i = 0; i < words.length; i += size) {
    const text = words.slice(i, i + size).join(' ');
    const created = await prisma.chunk.create({
      data: {
        docId: doc.id,
        text,
        embedding: JSON.stringify(embed(text)),
        sourceType: doc.sourceType,
        author: doc.author,
        entity: extractEntity(text),
      } as Prisma.ChunkUncheckedCreateInput,
    });
    chunks.push(created.id);
  }
  return { docId: doc.id, chunks: chunks.length };
}

function extractEntity(text: string): string | null {
  const m = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/);
  return m ? m[1] : null;
}

export { prisma };
