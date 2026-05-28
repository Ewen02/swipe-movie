import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MoviesModule } from '../movies/movies.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [MoviesModule],
})
export class AdminModule {}
