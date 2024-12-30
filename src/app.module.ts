import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';
import { ConsultationModule } from './consultation/consultation.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { HospitalsModule } from './hospitals/hospitals.module';

@Module({
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    LoggerModule,
    UserModule,
    ConsultationModule,
    AppointmentsModule,
    HospitalsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
