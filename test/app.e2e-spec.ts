import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from '../src/bootstrap';
import { PrismaClient } from '@prisma/client';
import { embed } from '../src/rag/embed';

const prisma = new PrismaClient();

describe('ragpilot-bff (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    await prisma.chunk.deleteMany();
    await prisma.document.deleteMany();
    app = await createApp();
    await app.init();
    const res = await request(app.getHttpServer()).post('/auth/token');
    token = res.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('rejects ingest without Bearer token (guard)', async () => {
    await request(app.getHttpServer()).post('/documents').send({ title: 'x', rawText: 'y' }).expect(401);
  });

  it('ingests + queries with token, returns grounded citations', async () => {
    await request(app.getHttpServer())
      .post('/documents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Acme kickoff', rawText: 'Acme meeting: lead investor Globex confirmed Series A.', sourceType: 'meeting_note' })
      .expect(201);

    const q = await request(app.getHttpServer())
      .post('/documents/query')
      .send({ question: 'Who led the Series A?' })
      .expect(200);
    expect(q.body.citations.length).toBeGreaterThan(0);
    expect(q.body.grounded).toBe(true);
  });

  it('exposes OpenAPI docs', async () => {
    const res = await request(app.getHttpServer()).get('/docs-json').expect(200);
    expect(res.body.info.title).toBe('ragpilot-bff');
  });
});

describe('embed (unit)', () => {
  it('produces normalized 384-dim vectors', () => {
    const v = embed('Acme Globex investor');
    expect(v.length).toBe(384);
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    expect(norm).toBeCloseTo(1, 5);
  });
});
