import { faker } from '@faker-js/faker';
import { db } from '../drizzle.seed';
import { appointmentsTable } from '../schemas/appointment.schema';
import { seedUserAuth } from './seed-auth';
import { seedDoctors } from './seed-doctor';
import { seedConsultation } from './seed-consultation';
import { conversationsTable } from '../schemas/conversation.schema';
import { SentBy } from 'src/consultation/consultation.enums';

export const seedConversations = async (
  consultations: Awaited<ReturnType<typeof seedConsultation>>,
  // usersAuth: Awaited<ReturnType<typeof seedUserAuth>>,
) => {
  // Seed appointments
  const conversationsData = Array.from({ length: 1500 }).map(() => {
    return {
      id: crypto.randomUUID(),
      date: faker.date.anytime(),
      consultationId: faker.helpers.arrayElement(consultations).id,
      sentBy: faker.helpers.arrayElement(Object.values(SentBy)),
      message: faker.lorem.sentences({ min: 1, max: 3 }),
    } as typeof conversationsTable.$inferInsert;
  });
  const conversationsDetails = await db
    .insert(conversationsTable)
    .values(conversationsData)
    .returning();

  return conversationsDetails;
};
