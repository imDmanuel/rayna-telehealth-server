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
  time,
} from 'drizzle-orm/pg-core';
import { usersTable } from './user.schema';
import { doctorsTable } from './doctor.schema';
import { conversationsTable } from './conversation.schema';

export const consultationsTable = pgTable('consultations', {
  sn: serial('sn').notNull().unique(),
  id: uuid('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  date: timestamp('date', { mode: 'date' }),
  startTime: time('start_time'),
  endTime: time('end_time'),
  location: varchar('location'),
  topic: text('topic'),
  doctorId: uuid('doctor_id')
    // .notNull()
    .references(() => doctorsTable.id, {
      onDelete: 'set null',
      onUpdate: 'set null',
    }),
  ongoing: boolean('ongoing').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
});

export const consultationRelations = relations(
  consultationsTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [consultationsTable.id],
      references: [usersTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [consultationsTable.doctorId],
      references: [doctorsTable.id],
    }),
    conversations: many(conversationsTable),
  }),
);
