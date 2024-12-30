import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetAllHospitalsQueryDto } from './dtos/hospitals.dto';
import { HospitalsService } from './hospitals.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ActiveUser } from 'src/auth/active-user.decorator';
import { ActiveUserData } from 'src/auth/auth.interfaces';

@Controller('v1/hospitals')
@UseGuards(JwtAuthGuard)
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get('/')
  getAllHospitals(
    @ActiveUser() activeUser: ActiveUserData,
    @Query() query: GetAllHospitalsQueryDto,
  ) {
    return this.hospitalsService.getAllHospitals(activeUser, query);
  }
}
