import { IsInt, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  date: string;

  @IsString()
  clockIn: string;

  @IsString()
  clockOut: string;

  @IsInt()
  totalHours: number;
}
