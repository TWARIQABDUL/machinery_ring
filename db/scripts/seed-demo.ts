import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config({ override: true, quiet: true });

// Real content from the Machinery Ring Rwanda brief — enough to make the
// Contact page's "Service needed" and "Local Ring" dropdowns work against
// the real database ahead of the admin CRUD that will manage these rows.

const RINGS = ["Kagomasi", "Biryogo", "Nyabagendwa", "Kabuye", "Mwendo"];

const SERVICES = [
  {
    name: "Maize and bean planting",
    slug: "maize-and-bean-planting",
    description:
      "Planting support uses available planting equipment, including hand-held planters. Seed, fertiliser and other input arrangements are agreed separately.",
    status: "available",
  },
  {
    name: "Maize shelling and rice threshing",
    slug: "maize-shelling-and-rice-threshing",
    description:
      "Separating maize grain from the cob or rice grain from the harvested crop, assessed against crop readiness, machine suitability and operator availability.",
    status: "available",
  },
  {
    name: "Training and agricultural advisory support",
    slug: "training-and-agricultural-advisory-support",
    description:
      "Practical learning on machinery use, crop establishment, soil health, spraying practices, post-harvest handling and farm-business skills.",
    status: "available",
  },
  {
    name: "Machinery operation and maintenance learning",
    slug: "machinery-operation-and-maintenance-learning",
    description: "Practical learning on equipment operation, routine checks, cleaning and maintenance.",
    status: "available",
  },
  {
    name: "Land preparation",
    slug: "land-preparation",
    description:
      "Depends on securing a suitable tractor, compatible implements and an operator. Dates can only be agreed once delivery capacity is confirmed.",
    status: "in_development",
  },
  {
    name: "Irrigation",
    slug: "irrigation",
    description: "Currently centres on demonstrations and practical learning rather than delivered irrigation work.",
    status: "in_development",
  },
];

async function seed() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  });

  await client.connect();
  console.log("Connected to the database");

  for (const name of RINGS) {
    await client.query(
      `INSERT INTO rings (name, whatsapp_invite_link)
       VALUES ($1, $2)
       ON CONFLICT (name) DO NOTHING`,
      [name, "https://chat.whatsapp.com/INVITE-LINK-PENDING"]
    );
  }
  console.log(`Seeded ${RINGS.length} rings (skipping any that already exist)`);

  for (const service of SERVICES) {
    await client.query(
      `INSERT INTO services (name, slug, description, status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO NOTHING`,
      [service.name, service.slug, service.description, service.status]
    );
  }
  console.log(`Seeded ${SERVICES.length} services (skipping any that already exist)`);

  await client.end();
}

seed().catch((error) => {
  console.error("Error seeding demo data:", error);
  process.exit(1);
});
