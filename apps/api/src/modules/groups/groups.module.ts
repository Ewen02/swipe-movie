import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

// EmailModule and PushModule are @Global, so NestEmailService and PushService
// are injectable here without importing them. PrismaService is provided app-wide.
@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
