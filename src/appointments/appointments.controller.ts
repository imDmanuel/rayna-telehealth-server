import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ActiveUser } from 'src/auth/active-user.decorator';
import { ActiveUserData } from 'src/auth/auth.interfaces';
import {
  GetAppointmentsByDateQueryDto,
  GetAppointmentsQueryDto,
} from './dtos/get-appointments.dto';

@Controller('v1/appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Get('/')
  getAllAppointments(
    @ActiveUser() activeUser: ActiveUserData,
    @Query() query: GetAppointmentsQueryDto,
  ) {
    return this.appointmentService.getAllAppointments(activeUser, query);
  }

  @Get('/by-date')
  getAppointmentsByDate(
    @ActiveUser() activeUser: ActiveUserData,
    @Query() query: GetAppointmentsByDateQueryDto,
  ) {
    return this.appointmentService.getAppointmentsByDate(activeUser, query);
  }
}
