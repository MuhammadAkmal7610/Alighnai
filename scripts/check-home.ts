
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const page = await prisma.page.findUnique({ where: { slug: 'home' } });
  console.log('--- PAGE ---');
  console.log(JSON.stringify(page, null, 2));
  const settings = await prisma.info.findUnique({ where: { type: 'SETTINGS' } });
  console.log('--- SETTINGS ---');
  console.log(JSON.stringify(settings, null, 2));
}
main().catch(console.error);
