import { PrismaClient, Role, EventType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const store = await prisma.store.upsert({
    where: { slug: "acme-bikes" },
    update: {},
    create: {
      name: "Acme Bikes",
      slug: "acme-bikes",
      timezone: "America/Los_Angeles"
    }
  });

  const passwordHash = await bcrypt.hash("steeringos", 10);

  await prisma.user.createMany({
    data: [
      {
        storeId: store.id,
        email: "jamie@acmebikes.com",
        name: "Jamie Rivera",
        password: passwordHash,
        role: Role.ADMIN
      },
      {
        storeId: store.id,
        email: "sam@acmebikes.com",
        name: "Sam Lee",
        password: passwordHash,
        role: Role.ANALYST
      },
      {
        storeId: store.id,
        email: "priya@acmebikes.com",
        name: "Priya Patel",
        password: passwordHash,
        role: Role.VIEWER
      }
    ],
    skipDuplicates: true
  });

  await prisma.apiKey.upsert({
    where: { key: "demo-key-acme" },
    update: {},
    create: {
      storeId: store.id,
      label: "Demo tracker key",
      key: "demo-key-acme"
    }
  });

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  const eventData = [] as Parameters<typeof prisma.event.createMany>[0]["data"];

  for (let day = 0; day < 90; day += 1) {
    const baseDate = new Date(startDate);
    baseDate.setDate(startDate.getDate() + day);

    const dailyVisitors = randomBetween(200, 480);
    for (let i = 0; i < dailyVisitors; i += 1) {
      const createdAt = new Date(baseDate);
      createdAt.setHours(randomBetween(0, 23), randomBetween(0, 59));
      const sessionId = `session-${day}-${i}`;
      eventData.push({
        storeId: store.id,
        type: EventType.visit,
        sessionId,
        userId: null,
        path: "/",
        device: Math.random() > 0.6 ? "mobile" : "desktop",
        country: "US",
        utmSource: Math.random() > 0.7 ? "newsletter" : "organic",
        utmMedium: "web",
        utmCampaign: "spring-launch",
        createdAt
      });

      if (Math.random() > 0.4) {
        eventData.push({
          storeId: store.id,
          type: EventType.view_item,
          sessionId,
          userId: null,
          path: "/products/gravel-pro",
          device: "mobile",
          country: "US",
          utmSource: "newsletter",
          utmMedium: "web",
          utmCampaign: "spring-launch",
          createdAt
        });
      }

      if (Math.random() > 0.7) {
        eventData.push({
          storeId: store.id,
          type: EventType.add_to_cart,
          sessionId,
          userId: null,
          path: "/cart",
          device: "mobile",
          country: "US",
          utmSource: "newsletter",
          utmMedium: "web",
          utmCampaign: "spring-launch",
          createdAt
        });
      }

      if (Math.random() > 0.8) {
        eventData.push({
          storeId: store.id,
          type: EventType.begin_checkout,
          sessionId,
          userId: null,
          path: "/checkout",
          device: "desktop",
          country: "US",
          utmSource: "newsletter",
          utmMedium: "web",
          utmCampaign: "spring-launch",
          createdAt
        });
      }

      if (Math.random() > 0.9) {
        eventData.push({
          storeId: store.id,
          type: EventType.purchase,
          sessionId,
          userId: null,
          path: "/thank-you",
          device: "desktop",
          country: "US",
          utmSource: "newsletter",
          utmMedium: "web",
          utmCampaign: "spring-launch",
          createdAt
        });
      }
    }
  }

  const now = new Date();
  for (let minute = 0; minute < 30; minute += 1) {
    const createdAt = new Date(now);
    createdAt.setMinutes(now.getMinutes() - minute);
    const spike = randomBetween(5, 15);
    for (let i = 0; i < spike; i += 1) {
      const sessionId = `live-${minute}-${i}`;
      eventData.push({
        storeId: store.id,
        type: EventType.view_item,
        sessionId,
        userId: null,
        path: "/products/aero-helmet",
        device: Math.random() > 0.5 ? "mobile" : "desktop",
        country: "US",
        utmSource: "paid",
        utmMedium: "cpc",
        utmCampaign: "flash-sale",
        createdAt
      });
    }
  }

  await prisma.event.createMany({ data: eventData });

  await prisma.auditLog.create({
    data: {
      storeId: store.id,
      action: "seed",
      entity: "Store",
      entityId: store.id,
      metadata: { detail: "Seeded demo store and event data" }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
