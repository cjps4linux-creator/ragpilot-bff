import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({ global: true, secret: process.env.JWT_SECRET || 'dev-secret-change-me', signOptions: { expiresIn: '1h' } })],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
