import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';

export class IngestDto {
  @IsString() title: string;
  @IsString() rawText: string;
  @IsOptional() @IsIn(['meeting_note', 'crm_record', 'report']) sourceType?: string;
  @IsOptional() @IsString() author?: string;
}

export class QueryDto {
  @IsString() question: string;
  @IsOptional() @IsArray() sourceTypes?: string[];
  @IsOptional() @IsString() entity?: string;
}

export class QueryResultDto {
  text: string;
  citations: { chunkId: number; snippet: string; sourceType: string; entity: string | null }[];
  grounded: boolean;
  retrievalScore: number;
}
