
import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  try {
    const pages = await prisma.page.findMany();
    console.log('Pages in DB:', JSON.stringify(pages, null, 2));
    
    const info = await prisma.info.findMany();
    console.log('Info in DB:', JSON.stringify(info, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

main();
