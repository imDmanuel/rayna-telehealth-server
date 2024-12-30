import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page?: number;
}
