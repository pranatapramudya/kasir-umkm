import { prisma } from './lib/prisma';
async function main() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log("Recent Tenants:");
  tenants.forEach(t => console.log(`- ${t.name} | id: ${t.id} | userId: ${t.userId} | createdAt: ${t.createdAt.toISOString()}`));
}
main().catch(console.error).finally(() => process.exit(0));
