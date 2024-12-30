import { Injectable } from '@nestjs/common';
import { desc, gte, sql, and, eq, lt, count } from 'drizzle-orm';
import { ActiveUserData } from 'src/auth/auth.interfaces';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { consultationsTable } from 'src/drizzle/schemas/consultation.schema';
import { doctorsTable } from 'src/drizzle/schemas/doctor.schema';
import { GetConsultationsQueryDto } from './dtos/get-consultations.dto';
import { conversationsTable } from 'src/drizzle/schemas/conversation.schema';
import { getPagination } from 'src/lib/utils';

@Injectable()
export class ConsultationService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getConsultations(
    activeUser: ActiveUserData,
    query: GetConsultationsQueryDto,
  ) {
    const { limit, offset } = getPagination(query.page, query.limit);

    const [consultations, [{ count: ongoingCount }], [{ count: closedCount }]] =
      await Promise.all([
        // Data query
        this.drizzleService.db.query.consultationsTable.findMany({
          where: and(
            eq(consultationsTable.userId, activeUser.userId),
            query.status === 'closed'
              ? eq(consultationsTable.ongoing, false)
              : eq(consultationsTable.ongoing, true),
          ),

          with: {
            doctor: true,
            conversations: true,
          },
          orderBy: [desc(consultationsTable.createdAt)],
          limit,
          offset,
        }),
        // ongoing count
        this.drizzleService.db
          .select({
            count: count(),
          })
          .from(consultationsTable)
          .where(
            and(
              eq(consultationsTable.userId, activeUser.userId),
              eq(consultationsTable.ongoing, true),
            ),
          ),
        // closed count
        this.drizzleService.db
          .select({
            count: count(),
          })
          .from(consultationsTable)
          .where(
            and(
              eq(consultationsTable.userId, activeUser.userId),
              eq(consultationsTable.ongoing, false),
            ),
          ),
      ]);

    return {
      message: 'Consultations fetched',
      data: consultations,
      meta: { ongoingCount, closedCount },
    };
  }

  async getUpcomingConsultation(activeUser: ActiveUserData) {
    const upcomingConsultation =
      await this.drizzleService.db.query.consultationsTable.findFirst({
        where: and(
          eq(consultationsTable.userId, activeUser.userId),
          gte(consultationsTable.date, new Date()),
        ), // TODO: work on this..
        with: {
          doctor: true,
        },
        orderBy: [desc(consultationsTable.date)], // Get the
        //   limit: 1, // should return only one consultation
      });

    return {
      message: 'Upcoming consultation fetched',
      data: upcomingConsultation ?? [],
    };
  }

  async getRecentConsultations(activeUser: ActiveUserData) {
    const recentConsultations =
      await this.drizzleService.db.query.consultationsTable.findMany({
        where: and(
          eq(consultationsTable.userId, activeUser.userId),
          lt(consultationsTable.date, new Date()),
        ),
        with: {
          doctor: true,
        },
        orderBy: [desc(consultationsTable.date)],
        limit: 5,
      });

    return {
      message: 'Recent consultations fetched',
      data: recentConsultations ?? [],
    };
  }

  async getOngoingConsultations(activeUser: ActiveUserData) {
    const ongoingConsultations =
      await this.drizzleService.db.query.consultationsTable.findMany({
        where: and(
          eq(consultationsTable.userId, activeUser.userId),
          eq(consultationsTable.ongoing, true),
        ),
        with: {
          doctor: true,
        },
        orderBy: [desc(consultationsTable.date)],
        limit: 5,
      });

    return ongoingConsultations;
  }
}
