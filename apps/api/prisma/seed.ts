import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Users ---
  // const user1 = await prisma.user.upsert({
  //   where: { email: 'user1@example.com' },
  //   update: {},
  //   create: { email: 'user1@example.com', name: 'User One' },
  // });

  // const user2 = await prisma.user.upsert({
  //   where: { email: 'user2@example.com' },
  //   update: {},
  //   create: { email: 'user2@example.com', name: 'User Two' },
  // });

  // const user3 = await prisma.user.upsert({
  //   where: { email: 'user3@example.com' },
  //   update: {},
  //   create: { email: 'user3@example.com', name: 'User Three' },
  // });

  // // --- Rooms ---
  // const room1 = await prisma.room.create({
  //   data: {
  //     code: 'ROOM1',
  //     name: 'First Demo Room',
  //     createdBy: user1.id,
  //     members: {
  //       create: [{ userId: user1.id }, { userId: user2.id }],
  //     },
  //   },
  // });

  // const room2 = await prisma.room.create({
  //   data: {
  //     code: 'ROOM2',
  //     name: 'Second Demo Room',
  //     createdBy: user3.id,
  //     members: {
  //       create: [{ userId: user3.id }],
  //     },
  //   },
  // });

  // // --- Swipes ---
  // await prisma.swipe.createMany({
  //   data: [
  //     { roomId: room1.id, userId: user1.id, movieId: 'movie-1', value: true },
  //     { roomId: room1.id, userId: user2.id, movieId: 'movie-1', value: true },
  //     { roomId: room1.id, userId: user1.id, movieId: 'movie-2', value: false },
  //     { roomId: room1.id, userId: user2.id, movieId: 'movie-3', value: true },
  //     { roomId: room2.id, userId: user3.id, movieId: 'movie-1', value: false },
  //     { roomId: room2.id, userId: user3.id, movieId: 'movie-2', value: true },
  //   ],
  // });

  // // --- Matches ---
  // await prisma.match.create({
  //   data: {
  //     roomId: room1.id,
  //     movieId: 'movie-1',
  //   },
  // });

  // console.log(
  //   '✅ Seed completed with 3 users, 2 rooms, 6 swipes, and 1 match.',
  // );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
