import { Module } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [HospitalsService],
  exports: [HospitalsService],
  controllers: [HospitalsController],
})
export class HospitalsModule {}
