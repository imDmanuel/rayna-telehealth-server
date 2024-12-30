import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [ConsultationService],
  controllers: [ConsultationController],
  exports: [ConsultationService],
})
export class ConsultationModule {}
