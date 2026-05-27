import { IsOptional, IsNumber, IsIn } from 'class-validator';

export class StartTrialDto {
  @IsOptional()
  @IsNumber()
  genreId?: number;

  @IsOptional()
  @IsIn(['movie', 'tv'])
  type?: 'movie' | 'tv';
}
