import { relations, sql } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { usersTable } from './user.schema';
import { doctorsTable } from './doctor.schema';
import { appointmentsTable } from './appointment.schema';

export const hospitalsTable = pgTable('hospitals', {
  sn: serial('sn').notNull().unique(),
  id: uuid('id').notNull().primaryKey(),
  name: varchar('name'),
  address: varchar('address'),
  phone: varchar('phone'),
  ratings: integer('ratings'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
});

export const hospitalRelations = relations(hospitalsTable, ({ one }) => ({
  appointment: one(appointmentsTable, {
    fields: [hospitalsTable.id],
    references: [appointmentsTable.hospitalId],
  }),
}));
