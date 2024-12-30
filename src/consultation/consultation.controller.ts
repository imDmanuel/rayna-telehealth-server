import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActiveUser } from 'src/auth/active-user.decorator';
import { ActiveUserData } from 'src/auth/auth.interfaces';
import { ConsultationService } from './consultation.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetConsultationsQueryDto } from './dtos/get-consultations.dto';

@Controller('v1/consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Get('/')
  async getConsultations(
    @ActiveUser() activeUser: ActiveUserData,
    @Query() query: GetConsultationsQueryDto,
  ) {
    return this.consultationService.getConsultations(activeUser, query);
  }

  @Get('upcoming-consultation')
  async getUpcomingConsultation(@ActiveUser() activeUser: ActiveUserData) {
    return this.consultationService.getUpcomingConsultation(activeUser);
  }

  @Get('recent-consultations')
  async getRecentConsultations(@ActiveUser() activeUser: ActiveUserData) {
    return this.consultationService.getRecentConsultations(activeUser);
  }
}
