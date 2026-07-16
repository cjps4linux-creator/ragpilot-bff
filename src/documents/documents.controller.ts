import { Controller, Post, Body, UseGuards, Get, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { IngestDto, QueryDto } from './documents.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly svc: DocumentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ingest a document (chunk + embed + persist)' })
  ingest(@Body() dto: IngestDto) {
    return this.svc.ingest(dto);
  }

  @Post('query')
  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieve grounded answer over ingested docs' })
  query(@Body() dto: QueryDto) {
    return this.svc.query(dto);
  }
}

@ApiTags('eval')
@Controller('eval')
export class EvalController {
  constructor(private readonly svc: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieval/grounding metrics' })
  snapshot() {
    return this.svc.evalSnapshot();
  }
}
