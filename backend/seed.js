import { prisma } from "./dist/src/lib/prisma.js";

const MOCK_PROPERTIES = [
  {
    id: "prop_01",
    title: "Skyline Penthouse",
    location: "Downtown Manhattan, NY",
    price: 8500,
    priceUnit: "month",
    beds: 3,
    baths: 2,
    sqft: 2100,
    type: "Penthouse",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    tags: ["City View", "Concierge", "Gym"],
    isFeatured: true,
    isNew: false,
  },
  {
    id: "prop_02",
    title: "Garden Terrace Villa",
    location: "Beverly Hills, CA",
    price: 12000,
    priceUnit: "month",
    beds: 5,
    baths: 4,
    sqft: 4800,
    type: "Villa",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
    tags: ["Pool", "Garden", "Garage"],
    isFeatured: false,
    isNew: true,
  },
  {
    id: "prop_03",
    title: "Minimalist Studio Loft",
    location: "SoHo, New York",
    price: 3200,
    priceUnit: "month",
    beds: 1,
    baths: 1,
    sqft: 650,
    type: "Studio",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    tags: ["Industrial", "High Ceilings", "Pet Friendly"],
    isFeatured: false,
    isNew: false,
  },
  {
    id: "prop_04",
    title: "Waterfront Apartment",
    location: "Miami Beach, FL",
    price: 5400,
    priceUnit: "month",
    beds: 2,
    baths: 2,
    sqft: 1350,
    type: "Apartment",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    tags: ["Ocean View", "Balcony", "Pool"],
    isFeatured: false,
    isNew: true,
  },
  {
    id: "prop_05",
    title: "Suburban Family Home",
    location: "Austin, TX",
    price: 4100,
    priceUnit: "month",
    beds: 4,
    baths: 3,
    sqft: 2900,
    type: "House",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    tags: ["Backyard", "Quiet Street", "Schools Nearby"],
    isFeatured: false,
    isNew: false,
  },
  {
    id: "prop_06",
    title: "Urban Glass Apartment",
    location: "Chicago, IL",
    price: 3800,
    priceUnit: "month",
    beds: 2,
    baths: 1,
    sqft: 1100,
    type: "Apartment",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    tags: ["Floor-to-Ceiling Windows", "Rooftop", "EV Charging"],
    isFeatured: false,
    isNew: false,
  },
  {
    id: "prop_07",
    title: "Rustic Hill House",
    location: "Malibu, CA",
    price: 9800,
    priceUnit: "month",
    beds: 4,
    baths: 3,
    sqft: 3200,
    type: "House",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    tags: ["Ocean View", "Deck", "Fireplace"],
    isFeatured: true,
    isNew: false,
  },
  {
    id: "prop_08",
    title: "Compact City Studio",
    location: "Brooklyn, NY",
    price: 2100,
    priceUnit: "month",
    beds: 1,
    baths: 1,
    sqft: 480,
    type: "Studio",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    tags: ["Furnished", "Laundry", "Near Subway"],
    isFeatured: false,
    isNew: false,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Collect all unique tag names
  const allTagNames = [...new Set(MOCK_PROPERTIES.flatMap((p) => p.tags))];

  // Upsert all tags first
  console.log(`📦 Upserting ${allTagNames.length} tags...`);
  await Promise.all(
    allTagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  // Fetch all tags to get their generated ids
  const tags = await prisma.tag.findMany({
    where: { name: { in: allTagNames } },
  });

  const tagMap = Object.fromEntries(tags.map((t) => [t.name, t.id]));

  // Upsert each property
  console.log(`🏠 Upserting ${MOCK_PROPERTIES.length} properties...`);
  for (const property of MOCK_PROPERTIES) {
    const { tags: tagNames, ...propertyData } = property;

    await prisma.property.upsert({
      where: { id: propertyData.id },
      update: {
        ...propertyData,
        tags: {
          set: tagNames.map((name) => ({ id: tagMap[name] })),
        },
      },
      create: {
        ...propertyData,
        tags: {
          connect: tagNames.map((name) => ({ id: tagMap[name] })),
        },
      },
    });

    console.log(`  ✓ ${propertyData.title}`);
  }

  console.log("✅ Seeding complete!");
}

seed()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
