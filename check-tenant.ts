import { prisma } from './lib/prisma';
async function main() {
  const users = await prisma.employee.findMany({
    where: { email: { contains: 'prapranata' } }
  });
  console.log("Employees:", users);

  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  console.log("Recent Tenants:", tenants.map(t => ({ id: t.id, name: t.name, createdAt: t.createdAt })));
}
main().catch(console.error).finally(() => process.exit(0));
