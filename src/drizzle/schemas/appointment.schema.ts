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
import { hospitalsTable } from './hospital.schema';

export const appointmentsTable = pgTable(
  'appointments',
  {
    sn: serial('sn').notNull().unique(),
    id: uuid('id').notNull().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id),
    date: timestamp('date', { mode: 'date' }),
    startTime: varchar('start_time', { length: 255 }),
    endTime: varchar('end_time', { length: 255 }),
    location: varchar('location'),
    topic: varchar('topic').notNull(),
    doctorId: uuid('doctor_id')
      // .notNull()
      .references(() => doctorsTable.id, {
        onDelete: 'set null',
        onUpdate: 'set null',
      }),
    hospitalId: uuid('hospital_id').references(() => hospitalsTable.id, {
      onDelete: 'set null',
      onUpdate: 'set null',
    }),
    cancelled: boolean('cancelled').default(false),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdateFn(() => new Date()),
  },
  (t) => ({
    // usersUserIdIdx: index('usersUserIdIdx').on(t.userId),
  }),
);

export const appointmentRelations = relations(appointmentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [appointmentsTable.id],
    references: [usersTable.id],
  }),
  doctor: one(doctorsTable, {
    fields: [appointmentsTable.doctorId],
    references: [doctorsTable.id],
  }),
  hospital: one(hospitalsTable),
}));
