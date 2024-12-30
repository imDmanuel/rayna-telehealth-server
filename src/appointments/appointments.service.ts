import { Injectable } from '@nestjs/common';
import { and, count, desc, eq, gt, gte, lt, lte } from 'drizzle-orm';
import { ActiveUserData } from 'src/auth/auth.interfaces';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { appointmentsTable } from 'src/drizzle/schemas/appointment.schema';
import { usersTable } from 'src/drizzle/schemas/user.schema';
import {
  GetAppointmentsByDateQueryDto,
  GetAppointmentsQueryDto,
} from './dtos/get-appointments.dto';
import { getPagination } from 'src/lib/utils';

@Injectable()
export class AppointmentsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getAllAppointments(
    activeUser: ActiveUserData,
    query: GetAppointmentsQueryDto,
  ) {
    const { limit, offset } = getPagination(query.page, query.limit);

    const [
      appointments,
      [{ allVisitsCount }],
      [{ upcomingVisitsCount }],
      [{ pastVisitsCount }],
      [{ cancelledVisitsCount }],
    ] = await Promise.all([
      // fetch appointments
      this.drizzleService.db.query.appointmentsTable.findMany({
        where: and(
          eq(appointmentsTable.userId, activeUser.userId),
          query.status === 'upcoming-visits'
            ? lte(appointmentsTable.date, new Date())
            : query.status === 'past-visits'
              ? gt(appointmentsTable.date, new Date())
              : query.status === 'cancelled-visits'
                ? eq(appointmentsTable.cancelled, true)
                : undefined,
        ),
        with: {
          doctor: true,
          hospital: true,
        },
        orderBy: [desc(appointmentsTable.date)],
        limit,
        offset,
      }),

      // fetch all visits count
      this.drizzleService.db
        .select({
          allVisitsCount: count(),
        })
        .from(appointmentsTable)
        .where(and(eq(appointmentsTable.userId, activeUser.userId))),

      // fetch upcoming visits count
      this.drizzleService.db
        .select({
          upcomingVisitsCount: count(),
        })
        .from(appointmentsTable)
        .where(
          and(
            eq(appointmentsTable.userId, activeUser.userId),
            lte(appointmentsTable.date, new Date()),
          ),
        ),

      // fetch past visits count
      this.drizzleService.db
        .select({
          pastVisitsCount: count(),
        })
        .from(appointmentsTable)
        .where(
          and(
            eq(appointmentsTable.userId, activeUser.userId),
            gt(appointmentsTable.date, new Date()),
          ),
        ),

      // fetch cancelled visits count
      this.drizzleService.db
        .select({
          cancelledVisitsCount: count(),
        })
        .from(appointmentsTable)
        .where(
          and(
            eq(appointmentsTable.userId, activeUser.userId),
            eq(appointmentsTable.cancelled, true),
          ),
        ),
    ]);

    return {
      message: 'Appointments fetched',
      data: appointments,
      meta: {
        allVisitsCount,
        upcomingVisitsCount,
        pastVisitsCount,
        cancelledVisitsCount,
      },
    };
  }

  async getAppointmentsByDate(
    activeUser: ActiveUserData,
    query: GetAppointmentsByDateQueryDto,
  ) {
    const appointments =
      await this.drizzleService.db.query.appointmentsTable.findMany({
        where: and(
          eq(appointmentsTable.userId, activeUser.userId),
          query.status === 'upcoming-visits'
            ? lte(appointmentsTable.date, new Date())
            : query.status === 'past-visits'
              ? gt(appointmentsTable.date, new Date())
              : query.status === 'cancelled-visits'
                ? eq(appointmentsTable.cancelled, true)
                : undefined,
        ),
        with: {
          doctor: true,
          hospital: true,
        },
        orderBy: [desc(appointmentsTable.date)],
      }); // TODO: Add date filtering to the query

    const groupedAppointments = appointments.reduce(
      (acc, appointment) => {
        const dateKey = appointment.date.toISOString().split('T')[0]; // YYYY-MM-DD
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(appointment);
        return acc;
      },
      {} as { [date: string]: typeof appointments },
    );

    return {
      data: groupedAppointments,
      message: 'Appointments fetched and grouped by date',
    };
  }
}
