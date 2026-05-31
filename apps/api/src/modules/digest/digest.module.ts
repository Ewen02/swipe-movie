import { Module } from '@nestjs/common';
import { DigestService } from './digest.service';
import { EmailModule } from '../email/email.module';

@Module({
  providers: [DigestService],
  imports: [EmailModule],
})
export class DigestModule {}
