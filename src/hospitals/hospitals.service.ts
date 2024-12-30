import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { GetAllHospitalsQueryDto } from './dtos/hospitals.dto';
import { and, count, eq, exists, inArray } from 'drizzle-orm';
import { hospitalsTable } from 'src/drizzle/schemas/hospital.schema';
import { usersTable } from 'src/drizzle/schemas/user.schema';
import { ActiveUserData } from 'src/auth/auth.interfaces';
import { appointmentsTable } from 'src/drizzle/schemas/appointment.schema';

@Injectable()
export class HospitalsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getAllHospitals(
    activeUser: ActiveUserData,
    query: GetAllHospitalsQueryDto,
  ) {
    const [allHospitals, recentlyVisitedHospitals, [{ hospitalsCount }]] =
      await Promise.all([
        // Fetch all hospitals
        this.drizzleService.db.query.hospitalsTable.findMany(),

        // Fetch recently visited hospitals
        this.drizzleService.db.query.hospitalsTable.findMany({
          where: inArray(
            hospitalsTable.id,
            this.drizzleService.db
              .selectDistinct({ hospitalId: appointmentsTable.hospitalId })
              .from(appointmentsTable)
              .where(eq(appointmentsTable.userId, activeUser.userId)),
          ),
        }),

        // fetch all hostpitals count
        this.drizzleService.db
          .select({
            hospitalsCount: count(),
          })
          .from(hospitalsTable),

        //  TODO: fetch recently visited hospitals count
      ]);

    return {
      message: 'Hospitals fetched',
      data: allHospitals,
      meta: {
        hospitalsCount,
      },
    };
  }
}
