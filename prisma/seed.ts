import { hashSync } from "bcrypt";

import { prisma } from "./prisma-client";

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: "User",
        email: "user@example.com",
        password: hashSync("11111111", 10),
        verified: new Date(),
        role: "USER",
      },
      {
        fullName: "Admin",
        email: "admin@example.com",
        password: hashSync("11111111", 10),
        verified: new Date(),
        role: "ADMIN",
      },
    ],
  });
}

async function down() {}

async function main() {
  await up();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
