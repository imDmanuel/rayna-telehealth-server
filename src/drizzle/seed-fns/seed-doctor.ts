import { faker } from '@faker-js/faker';
import { db } from '../drizzle.seed';
import { doctorsTable } from '../schemas/doctor.schema';

export const seedDoctors = async (doctorCount: number = 5) => {
  const doctorsData = Array.from({ length: doctorCount }).map(() => {
    return {
      id: crypto.randomUUID(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      specialty: faker.helpers.arrayElement([
        'Cardiology',
        'Dermatology',
        'Pediatrics',
        'Orthopedics',
      ]),
      profilePic: faker.image.avatar(),
    } as typeof doctorsTable.$inferInsert;
  });
  return await db.insert(doctorsTable).values(doctorsData).returning();
};
