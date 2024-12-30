import { faker } from '@faker-js/faker';
import { db } from '../drizzle.seed';
import { consultationsTable } from '../schemas/consultation.schema';
import { seedDoctors } from './seed-doctor';
import { seedUserAuth } from './seed-auth';

export const seedConsultation = async (
  doctors: Awaited<ReturnType<typeof seedDoctors>>,
  usersAuth: Awaited<ReturnType<typeof seedUserAuth>>,
) => {
  const consultationsData = Array.from({ length: 200 }).map(() => {
    return {
      id: crypto.randomUUID(),
      date: faker.date.anytime(),
      doctorId: faker.helpers.arrayElement(doctors).id,
      ongoing: faker.datatype.boolean(),
      location: faker.location.streetAddress(),
      userId: faker.helpers.arrayElement(usersAuth).userId,
      startTime: `${faker.number.int({ min: 8, max: 16 })}:00`,
      endTime: `${faker.number.int({ min: 8, max: 16 })}:00`,
      topic: faker.lorem.sentence(),
    } as typeof consultationsTable.$inferInsert;
  });
  const consultationDetails = await db
    .insert(consultationsTable)
    .values(consultationsData)
    .returning();

  return consultationDetails;
};
