import { Module, Global } from '@nestjs/common';
import { NestEmailService } from './email.service';

@Global()
@Module({
  providers: [NestEmailService],
  exports: [NestEmailService],
})
export class EmailModule {}
