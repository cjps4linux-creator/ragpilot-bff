import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}
  @Get()
  root() {
    return this.app.root();
  }
  @Get('health')
  health() {
    return this.app.health();
  }
}
