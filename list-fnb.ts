import { prisma } from './lib/prisma';
async function main() {
  const t = await prisma.tenant.findMany({ where: { name: { contains: 'dimsum' } } });
  console.log(t);
}
main().catch(console.error).finally(() => process.exit(0));
