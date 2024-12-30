import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/lib/dtos/pagination-query.dto';

export class GetConsultationsQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  status: 'ongoing' | 'closed' | undefined;
}
