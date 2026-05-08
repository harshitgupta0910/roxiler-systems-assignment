import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@storerate.com" },
    update: {},
    create: {
      name: "System Administrator Account",
      email: "admin@storerate.com",
      password: passwordHash,
      address: "123 Admin Avenue, San Francisco, CA",
      role: "ADMIN"
    }
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@storerate.com" },
    update: {},
    create: {
      name: "Primary Store Owner Account",
      email: "owner@storerate.com",
      password: passwordHash,
      address: "88 Market Street, San Francisco, CA",
      role: "OWNER"
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "user@storerate.com" },
    update: {},
    create: {
      name: "Normal Platform User Account",
      email: "user@storerate.com",
      password: passwordHash,
      address: "456 Mission Road, San Francisco, CA",
      role: "USER"
    }
  });

  const stores = await prisma.store.createMany({
    data: [
      {
        name: "Aurora Coffee Collective",
        email: "aurora@store.com",
        address: "22 Valencia Street, San Francisco, CA",
        ownerId: owner.id
      },
      {
        name: "Slate & Pine Grocery",
        email: "slatepine@store.com",
        address: "417 Howard Street, San Francisco, CA",
        ownerId: owner.id
      }
    ],
    skipDuplicates: true
  });

  const storeList = await prisma.store.findMany();
  if (storeList.length > 0) {
    await prisma.rating.createMany({
      data: [
        { userId: user.id, storeId: storeList[0].id, rating: 4 },
        { userId: user.id, storeId: storeList[1].id, rating: 5 }
      ],
      skipDuplicates: true
    });
  }

  console.log("Seed data created:", { admin: admin.email, owner: owner.email, user: user.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
