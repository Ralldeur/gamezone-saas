import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gamezone.ci" },
    update: {},
    create: {
      email: "admin@gamezone.ci",
      name: "Admin GameZone",
      hashedPassword,
      role: "ADMIN",
    },
  });

  const room = await prisma.gameRoom.upsert({
    where: { id: "room-1" },
    update: {},
    create: {
      id: "room-1",
      name: "GameZone Cocody",
      address: "Rue des Jardins, Cocody, Abidjan",
      phone: "+225 07 08 09 10 11",
      hourlyRate: 500,
      ownerId: admin.id,
    },
  });

  const employeePassword = await bcrypt.hash("employee123", 10);
  await prisma.user.upsert({
    where: { email: "moussa@gamezone.ci" },
    update: {},
    create: {
      email: "moussa@gamezone.ci",
      name: "Moussa Koné",
      hashedPassword: employeePassword,
      role: "EMPLOYEE",
      roomId: room.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "awa@gamezone.ci" },
    update: {},
    create: {
      email: "awa@gamezone.ci",
      name: "Awa Diallo",
      hashedPassword: employeePassword,
      role: "EMPLOYEE",
      roomId: room.id,
    },
  });

  const stations = [
    { name: "PS5 - Poste 1", type: "PS5", hourlyRate: 1000 },
    { name: "PS5 - Poste 2", type: "PS5", hourlyRate: 1000 },
    { name: "PS4 - Poste 1", type: "PS4", hourlyRate: 500 },
    { name: "PS4 - Poste 2", type: "PS4", hourlyRate: 500 },
    { name: "PS4 - Poste 3", type: "PS4", hourlyRate: 500 },
    { name: "Xbox - Poste 1", type: "XBOX", hourlyRate: 750 },
    { name: "PC Gamer 1", type: "PC", hourlyRate: 600 },
    { name: "PC Gamer 2", type: "PC", hourlyRate: 600 },
  ];

  for (const station of stations) {
    await prisma.station.create({
      data: {
        ...station,
        roomId: room.id,
      },
    });
  }

  console.log("Seed completed!");
  console.log("Admin: admin@gamezone.ci / admin123");
  console.log("Employee: moussa@gamezone.ci / employee123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
