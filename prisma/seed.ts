import { seedDemoDataAction } from "../app/actions";

async function main() {
  console.log("Seeding demo data into SQLite database...");
  await seedDemoDataAction();
  console.log("Demo data successfully seeded!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
