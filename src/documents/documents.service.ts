import { Injectable, Logger } from '@nestjs/common';
import { QueryDto, QueryResultDto } from './documents.dto';
import { ingestDocument, retrieve } from '../rag/store';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private metrics = { queries: 0, grounded: 0, retrieved: 0 };

  async ingest(input: { title: string; rawText: string; sourceType?: string; author?: string }) {
    const res = await ingestDocument(input);
    this.logger.log(`ingested doc ${res.docId} (${res.chunks} chunks)`);
    return res;
  }

  async query(dto: QueryDto): Promise<QueryResultDto> {
    const chunks = await retrieve(dto.question, {
      sourceTypes: dto.sourceTypes,
      entity: dto.entity,
    });
    this.metrics.queries++;
    this.metrics.retrieved += chunks.length;
    const grounded = chunks.length > 0;
    if (grounded) this.metrics.grounded++;
    const text = chunks
      .slice(0, 3)
      .map((c) => `${c.entity || 'source'}: ${c.text.slice(0, 180)}`)
      .join(' | ');
    return {
      text,
      citations: chunks.map((c) => ({
        chunkId: c.id,
        snippet: c.text.slice(0, 180),
        sourceType: c.sourceType,
        entity: c.entity,
      })),
      grounded,
      retrievalScore: chunks[0]?.score ?? 0,
    };
  }

  evalSnapshot() {
    const q = this.metrics.queries;
    return {
      queries: q,
      avgRetrieved: q ? this.metrics.retrieved / q : 0,
      groundingRate: q ? this.metrics.grounded / q : 0,
    };
  }
}
