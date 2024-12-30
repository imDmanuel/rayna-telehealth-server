import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/lib/dtos/pagination-query.dto';

export class GetAppointmentsQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  status:
    | 'upcoming-visits'
    | 'past-visits'
    | 'cancelled-visits'
    | 'all-visits'
    | undefined;
}

export class GetAppointmentsByDateQueryDto extends GetAppointmentsQueryDto {
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @Type(() => Date)
  @IsOptional()
  endDate?: Date;
}
