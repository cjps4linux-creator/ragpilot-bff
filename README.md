# ragpilot-bff — NestJS BFF for the ragpilot RAG contract

A **Backend-for-Frontend** in NestJS that wraps the [ragpilot](https://github.com/cjps4linux-creator/ragpilot)
RAG contract: ingest → embed → retrieve → cite → ground → evaluate. Built to demonstrate
production NestJS discipline — modules, DI, guards, interceptors-style piping, Swagger/OpenAPI,
Prisma, JWT auth, and tested e2e — for roles that ask for **NestJS / TypeScript / Node.js**.

## Stack
- **NestJS 10** — modules, controllers, services, dependency injection
- **Prisma + SQLite** (swap `DATABASE_URL` for PostgreSQL in prod) — documents + chunks
- **JWT guard** (`@nestjs/jwt`) — `/auth/token` issues, `JwtAuthGuard` protects ingest
- **Swagger / OpenAPI** at `/docs` (spec at `/docs-json`)
- **ValidationPipe** (global, `whitelist: true`) + `class-validator` DTOs
- **Vitest** e2e (guard 401, ingest+query+citations, OpenAPI) + unit (embed)

## Run locally
```bash
npm install
npx prisma generate
npx prisma db push --skip-generate
cp .env.example .env
npm run start:dev
# token:  POST /auth/token -> { access_token }
# ingest: POST /documents (Bearer) { title, rawText, sourceType?, author? }
# query:  POST /documents/query { question, sourceTypes?, entity? }
# eval:   GET  /eval
# docs:   GET  /docs
```

## Honest scope
This is a **demonstration BFF**, not a 5-year production system. It proves NestJS fluency:
structured modules, DI, a real guard, OpenAPI contract, Prisma persistence, and a green
e2e suite. The embedder is the same lexical mock ragpilot uses (swap for
`sentence-transformers` on the Python side); the BFF's value is the **API architecture**,
not the ML.

## Maps to a NestJS JD
- NestJS modules / controllers / services / DI ...... `src/*` module structure
- Guards / auth ................................. `src/auth/jwt-auth.guard.ts`
- Swagger / OpenAPI ............................. `src/bootstrap.ts`
- Prisma + ORM .................................. `prisma/schema.prisma`
- Testing ....................................... `test/app.e2e-spec.ts`
