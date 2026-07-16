import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Auth guard over an HS256 JWT. Dev token issued via /auth/token.
 * Mirrors the role/scope discipline NestJS shops expect (guards + DI).
 */
@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  issueToken(sub = 'demo-user'): string {
    return this.jwt.sign({ sub });
  }

  async validate(payload: { sub: string }): Promise<{ sub: string }> {
    if (!payload?.sub) throw new UnauthorizedException('invalid token');
    return payload;
  }
}

export { prisma };
