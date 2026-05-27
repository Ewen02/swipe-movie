import { Module } from '@nestjs/common';
import { TrialController } from './trial.controller';
import { TrialService } from './trial.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TrialController],
  providers: [TrialService],
})
export class TrialModule {}
