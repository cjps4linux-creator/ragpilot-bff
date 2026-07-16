import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  root() {
    return { name: 'ragpilot-bff', version: '0.1.0', docs: '/docs' };
  }
  health() {
    return { status: 'ok' };
  }
}
