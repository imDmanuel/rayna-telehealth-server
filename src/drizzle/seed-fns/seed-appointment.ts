import { faker } from '@faker-js/faker';
import { db } from '../drizzle.seed';
import { appointmentsTable } from '../schemas/appointment.schema';
import { seedUserAuth } from './seed-auth';
import { seedDoctors } from './seed-doctor';
import { seedHospitals } from './seed-hospital';

export const seedAppointments = async (
  doctors: Awaited<ReturnType<typeof seedDoctors>>,
  hospitals: Awaited<ReturnType<typeof seedHospitals>>,
  usersAuth: Awaited<ReturnType<typeof seedUserAuth>>,
) => {
  // Seed appointments
  const appointmentsData = Array.from({ length: 600 }).map(() => {
    return {
      id: crypto.randomUUID(),
      date: faker.date.anytime(),
      doctorId: faker.helpers.arrayElement(doctors).id,
      location: faker.location.streetAddress(),
      topic: faker.lorem.sentence(),
      userId: faker.helpers.arrayElement(usersAuth).userId,
      hospitalId: faker.helpers.arrayElement(hospitals).id,
      startTime: `${faker.number.int({ min: 8, max: 16 })}:00`,
      endTime: `${faker.number.int({ min: 8, max: 16 })}:30`,
      cancelled: faker.datatype.boolean(),
    } as typeof appointmentsTable.$inferInsert;
  });
  const appointmentDetails = await db
    .insert(appointmentsTable)
    .values(appointmentsData)
    .returning();

  return appointmentDetails;
};
