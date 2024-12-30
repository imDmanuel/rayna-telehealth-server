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
  pgEnum,
} from 'drizzle-orm/pg-core';
import { SentBy } from 'src/consultation/consultation.enums';
import { consultationsTable } from './consultation.schema';

export const sentByEnum = pgEnum('sent_by', [SentBy.PATIENT, SentBy.DOCTOR]);

export const conversationsTable = pgTable('conversations', {
  sn: serial('sn').notNull().unique(),
  id: uuid('id').notNull().primaryKey(),
  consultationId: uuid('consultation_id')
    .notNull()
    .references(() => consultationsTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  date: timestamp('date', { mode: 'date' }),
  message: text('message'),
  sentBy: sentByEnum('sent_by').notNull().default(SentBy.PATIENT),
  createdAt: timestamp('created_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
});

export const conversationRelations = relations(
  conversationsTable,
  ({ one }) => ({
    consultation: one(consultationsTable, {
      fields: [conversationsTable.consultationId],
      references: [consultationsTable.id],
    }),
  }),
);
