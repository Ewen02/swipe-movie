import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Add your seed data here
  // Example:
  // const user = await prisma.user.upsert({
  //   where: { email: 'demo@example.com' },
  //   update: {},
  //   create: { email: 'demo@example.com', name: 'Demo User' },
  // });

  console.log('✅ Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
