import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
export const DRIZZLE = Symbol('drizzle-connection');
import { DrizzleService } from './drizzle.service';

@Module({
  providers: [
    DrizzleService,
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databasURL = configService.get<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString: databasURL,
          ssl: true,
        });
        return pool;
      },
    },
  ],
  exports: [DRIZZLE, DrizzleService],
})
export class DrizzleModule {}
