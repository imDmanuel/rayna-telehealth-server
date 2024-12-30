import { relations, sql, SQL } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { consultationsTable } from './consultation.schema';
import { appointmentsTable } from './appointment.schema';

export const doctorsTable = pgTable('doctors', {
  sn: serial('sn').notNull().unique(),
  id: uuid('id').notNull().primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  specialty: varchar('specialty', { length: 255 }).notNull(),
  isVerified: boolean('is_verified').default(true),
  profilePic: varchar('profile_pic', { length: 255 }),
});

export const doctorRelations = relations(doctorsTable, ({ one }) => ({
  consultation: one(consultationsTable, {
    fields: [doctorsTable.id],
    references: [consultationsTable.doctorId],
  }),
  appointment: one(appointmentsTable, {
    fields: [doctorsTable.id],
    references: [appointmentsTable.doctorId],
  }),
}));
