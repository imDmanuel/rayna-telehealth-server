import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schemas/schema';
import { DRIZZLE } from './drizzle.module';

@Injectable()
export class DrizzleService {
  public db: NodePgDatabase<typeof schema>;
  constructor(@Inject(DRIZZLE) private readonly pool: Pool) {
    this.db = drizzle(pool, { schema, logger: true }) as NodePgDatabase<
      typeof schema
    >;
  }
}
