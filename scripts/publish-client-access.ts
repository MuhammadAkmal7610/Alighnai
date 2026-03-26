/**
 * One-off: set the Client Access CMS page to PUBLISHED (schema default is DRAFT).
 * Run after deploy if the row was created earlier as draft:
 *   npm run db:publish-client-access
 */
import "dotenv/config";
import { ContentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  const result = await prisma.page.updateMany({
    where: { slug: "client-access" },
    data: { status: ContentStatus.PUBLISHED },
  });
  console.log(
    `client-access: updated ${result.count} row(s) → PUBLISHED`
  );
  if (result.count === 0) {
    console.log("No row with slug 'client-access'. Run: npm run db:seed");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
