import { relations } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { authTable } from './auth.schema';

export const usersTable = pgTable('users', {
  sn: serial('sn').notNull().unique(),
  id: uuid('id').notNull().primaryKey(),
  // .references(() => Auth.userId),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  profileImage: varchar('profile_image'),
  age: integer('age'),
  weight: varchar('weight'),
  height: varchar('height', { length: 255 }),
  dateOfBirth: date('date_of_birth', { mode: 'date' }),
  hmoId: varchar('hmo_id'),
  hmoPlan: varchar('hmoPlan'),
  bloodPressure: varchar('blood_pressure', { length: 100 }),
  cholesterolLevels: varchar('cholesterol_levels', { length: 100 }),
  glucoseLevels: varchar('glucose_levels', { length: 100 }),
  expiresOn: timestamp('expires_on', { mode: 'date' }),
  isActive: boolean('is_active').default(true).notNull(),
});

export const usersRelations = relations(usersTable, ({ one }) => ({
  auth: one(authTable, {
    fields: [usersTable.id],
    references: [authTable.userId],
  }),
}));
