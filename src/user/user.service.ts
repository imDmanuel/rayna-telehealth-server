import { Injectable, NotFoundException } from '@nestjs/common';
import { desc, gte, sql } from 'drizzle-orm';
import { ActiveUserData } from 'src/auth/auth.interfaces';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { ErrorResponse } from 'src/lib/interfaces';

@Injectable()
export class UserService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getUser(activeUser: ActiveUserData) {
    const user = await this.drizzleService.db.query.usersTable.findFirst({
      where: (user, { eq }) => eq(user.id, activeUser.userId),
      with: {
        auth: {
          columns: {
            email: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException({
        reason: 'not-found',
        message: 'This user does not exist',
      } as ErrorResponse);
    }

    return { message: 'User retrieved successfully', data: user };
  }
}
