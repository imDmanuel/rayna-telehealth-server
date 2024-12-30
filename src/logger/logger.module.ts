import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global() // Makes the LoggerModule available globally
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
