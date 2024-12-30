import { BcryptService } from 'src/hashing/bcrypt.service';
import { faker } from '@faker-js/faker';
import { usersTable } from '../schemas/user.schema';
import { db } from '../drizzle.seed';
import { authTable } from '../schemas/auth.schema';

function generateHmoId() {
  const prefix = 'RET/';
  const randomNumber = faker.number.int({ min: 10000, max: 99999 }); // Random 5-digit number
  const randomLetter = faker.string.alpha({ length: 1 }).toUpperCase(); // Random uppercase letter

  return `${prefix}${randomNumber}/${randomLetter}`;
}

const bcryptSErvice = new BcryptService();
export const seedUserAuth = async ({
  userCount = 10,
}: {
  userCount?: number;
}) => {
  const password = 'securePassword123';
  // Hash the password for database storage
  const usersData = Array.from({ length: userCount }).map(() => {
    const uuid = crypto.randomUUID();
    const hmoId = generateHmoId();
    return {
      id: uuid,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      profileImage: faker.image.avatar(),
      age: faker.number.int({ min: 18, max: 80 }),
      weight: `${faker.number.int({ min: 50, max: 100 })} kg`,
      height: `${faker.number.int({ min: 150, max: 200 })} cm`,
      dateOfBirth: faker.date.birthdate({ mode: 'age', min: 18, max: 80 }),
      hmoId: hmoId,
      bloodPressure: `${faker.number.int({ min: 80, max: 120 })}/${faker.number.int({ min: 60, max: 80 })} mg/dL`,
      cholesterolLevels: `${faker.number.int({ min: 100, max: 240 })} mg/dL`,
      glucoseLevels: `${faker.number.int({ min: 70, max: 140 })} mg/dL`,
      hmoPlan: 'Red Beryl',
      isActive: faker.datatype.boolean(),
      expiresOn: faker.date.anytime(),
    } as typeof usersTable.$inferInsert;
  });

  // console.log(usersData);
  // return;
  const u = await db.insert(usersTable).values(usersData).returning();
  const authData = await Promise.all(
    Array.from({ length: userCount }).map(async (_, index) => {
      const hashedPassword = await bcryptSErvice.hash(password);
      return {
        email: faker.internet.email(),
        password: hashedPassword,
        userId: usersData[index].id,
        emailVerified: true,
      } as typeof authTable.$inferInsert;
    }),
  );
  const r = await db.insert(authTable).values(authData).returning();
  console.log(u);
  return r;
};
