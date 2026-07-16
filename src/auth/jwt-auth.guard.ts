import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const header = req.headers['authorization'];
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('missing bearer');
    try {
      const token = header.slice('Bearer '.length).trim();
      const payload = this.jwt.verify(token);
      (req as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('invalid token');
    }
  }
}
