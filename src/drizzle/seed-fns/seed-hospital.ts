import { faker } from '@faker-js/faker';
import { db } from '../drizzle.seed';
import { hospitalsTable } from '../schemas/hospital.schema';

export const seedHospitals = async (hospitalCount: number = 20) => {
  const hospitalsData = Array.from({ length: hospitalCount }).map(() => {
    return {
      id: crypto.randomUUID(),
      address: faker.location.streetAddress(),
      name: faker.company.name(),
      phone: faker.phone.number(),
      ratings: faker.number.int({ min: 1, max: 5 }),
    } as typeof hospitalsTable.$inferInsert;
  });
  return await db.insert(hospitalsTable).values(hospitalsData).returning();
};
