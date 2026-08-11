import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany();
  console.log("All Tenants:", tenants);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
