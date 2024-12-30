import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { usersTable } from './user.schema';
import { AuthMethod } from 'src/auth/enums/auth-method.enum';
import { OtpFor } from 'src/auth/enums/otp-for.enum';

// Define the enum in PostgreSQL
export const authMethodEnum = pgEnum('auth_method', [
  AuthMethod.EMAIL,
  AuthMethod.GOOGLE,
]);

export const otpForEnum = pgEnum('otp_for', [
  OtpFor.SIGNUP,
  OtpFor.FORGOT_PASSWORD,
]);

export const authTable = pgTable('auth', {
  sn: serial('sn').notNull().unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  authMethod: authMethodEnum('auth_method').default(AuthMethod.EMAIL),
  otpHash: varchar('otp_hash').default(null),
  otpExpiry: timestamp('otp_expiry', { mode: 'date' }).default(null),
  otpFor: otpForEnum('otp_for').default(null),
});

export const authRelations = relations(authTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [authTable.userId],
    references: [usersTable.id],
  }),
}));
