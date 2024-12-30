import { drizzle } from 'drizzle-orm/node-postgres';
import { seedUserAuth } from './seed-fns/seed-auth';
import { seedDoctors } from './seed-fns/seed-doctor';
import { seedConsultation } from './seed-fns/seed-consultation';
import { seedAppointments } from './seed-fns/seed-appointment';
import { seed } from 'drizzle-seed';
import * as schema from './schemas/schema';
import { seedConversations } from './seed-fns/seed-conversations';
import { Pool } from 'pg';
import { seedHospitals } from './seed-fns/seed-hospital';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool);
console.log(process.env.DATABASE_URL);

async function main() {
  const usersAuth = await seedUserAuth({ userCount: 5 });
  const doctors = await seedDoctors(10);
  const consultations = await seedConsultation(doctors, usersAuth);
  const hospitals = await seedHospitals();
  await seedAppointments(doctors, hospitals, usersAuth);
  await seedConversations(consultations);
  // await seed(db, schema).refine((f) => ({
  //   users: {
  //     columns: {
  //       id: f.uuid(),
  //       firstName: f.firstName({ isUnique: true }),
  //       lastName: f.lastName({ isUnique: true }),
  //       // profileImage: f.
  //       age: f.int({ minValue: 5, maxValue: 80 }),
  //       weight: f.int({ minValue: 30, maxValue: 100 }),
  //       height: f.int({minValue: 10, maxValue: 20})
  //       dateOfBirth: f.date({min})
  //       // hmoId
  //       // bloodPressure
  //       // cholesterolLevels
  //       // glucoseLevels
  //     },
  //     count: 20,
  //   },
  // }));
}

main();
