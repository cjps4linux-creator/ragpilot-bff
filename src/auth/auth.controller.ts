import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('token')
  issue() {
    return { access_token: this.auth.issueToken() };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me() {
    return { sub: 'demo-user' };
  }
}
