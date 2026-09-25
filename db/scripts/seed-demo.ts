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

const GALLERY_ITEMS = [
  {
    image_path: "https://images.pexels.com/photos/32047262/pexels-photo-32047262.jpeg?auto=compress&cs=tinysrgb&w=1280",
    caption: "Aerial view of farmland showing the patchwork of cooperative fields across the region.",
    category: "field_days",
  },
  {
    image_path: "https://images.pexels.com/photos/27229388/pexels-photo-27229388.jpeg?auto=compress&cs=tinysrgb&w=1280",
    caption: "A farmer operating a combine harvester during a busy harvest season.",
    category: "equipment",
  },
  {
    image_path: "https://images.pexels.com/photos/26380845/pexels-photo-26380845.jpeg?auto=compress&cs=tinysrgb&w=1280",
    caption: "Tractors working side by side during a cooperative harvest day.",
    category: "field_days",
  },
  {
    image_path: "https://images.pexels.com/photos/37044006/pexels-photo-37044006.jpeg?auto=compress&cs=tinysrgb&w=1280",
    caption: "Aerial view of a tractor preparing land ahead of the planting season.",
    category: "equipment",
  },
  {
    image_path: "https://images.pexels.com/photos/18135422/pexels-photo-18135422.jpeg?auto=compress&cs=tinysrgb&w=1280",
    caption: "A tractor at work on a demonstration farm, showing land preparation in practice.",
    category: "demonstration_farms",
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

  for (let i = 0; i < GALLERY_ITEMS.length; i++) {
    const item = GALLERY_ITEMS[i];
    await client.query(
      `INSERT INTO gallery_items (image_path, caption, category, is_published, sort_order)
       VALUES ($1, $2, $3, true, $4)
       ON CONFLICT DO NOTHING`,
      [item.image_path, item.caption, item.category, i + 1]
    );
  }
  console.log(`Seeded ${GALLERY_ITEMS.length} gallery items (skipping any that already exist)`);

  await client.end();
}

seed().catch((error) => {
  console.error("Error seeding demo data:", error);
  process.exit(1);
});
