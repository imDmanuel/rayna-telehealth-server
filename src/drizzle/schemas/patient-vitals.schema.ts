// import { relations } from 'drizzle-orm';
// import {
//   date,
//   index,
//   integer,
//   pgTable,
//   serial,
//   text,
//   uuid,
//   varchar,
// } from 'drizzle-orm/pg-core';
// import { User } from './user.schema';

// export const PatientVitals = pgTable(
//   'patient_vitals',
//   {
//     sn: serial('sn').notNull().unique(),
//     id: uuid('id').notNull().primaryKey(),
//     // .references(() => Auth.userId),
//     firstName: varchar('first_name', { length: 255 }).notNull(),
//     lastName: varchar('last_name', { length: 255 }).notNull(),
//     age: integer('age'),
//     weight: varchar('weight'),
//     height: varchar('height', { length: 255 }),
//     dateOfBirth: date('date_of_birth', { mode: 'date' }),
//     hmoId: varchar('hmo_id'),
//   },
//   (t) => ({
//     // usersUserIdIdx: index('usersUserIdIdx').on(t.userId),
//   }),
// );

// export const usersRelations = relations(User, ({ one }) => ({
//   auth: one(Auth, {
//     fields: [User.id],
//     references: [Auth.userId],
//   }),
// }));
