import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: npx ts-node scripts/promote-admin.ts <email>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, roles: true },
  });

  if (!user) {
    console.error(`User with email "${email}" not found`);
    process.exit(1);
  }

  if (user.roles.includes('admin')) {
    console.log(`User ${email} is already an admin`);
    process.exit(0);
  }

  await prisma.user.update({
    where: { email },
    data: { roles: [...user.roles, 'admin'] },
  });

  console.log(`User ${email} promoted to admin`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
