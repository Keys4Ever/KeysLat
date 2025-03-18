import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateUrlStatsDto {
  @IsNotEmpty()
  @IsNumber()
  url_id: number;

  @IsNotEmpty()
  @IsNumber()
  clicks: number;

  @IsNotEmpty()
  @IsDateString()
  access_date: string;
}
