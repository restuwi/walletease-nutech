import db from "../src/db";
import { seedDatabase } from "./seeders";

async function main() {
  await seedDatabase();
}

main()
  .then(() => {
    console.log("Database seeded");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
