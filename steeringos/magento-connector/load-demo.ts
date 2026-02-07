import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const demoPath = path.join(process.cwd(), "magento-connector", "demo.json");
  const content = fs.readFileSync(demoPath, "utf8");
  const payload = JSON.parse(content) as {
    storeSlug: string;
    orders: { id: string; total: number; createdAt: string }[];
    products: { id: string; name: string; price: number }[];
  };

  const store = await prisma.store.findUnique({ where: { slug: payload.storeSlug } });
  if (!store) {
    throw new Error("Store not found. Run prisma/seed first.");
  }

  await prisma.event.createMany({
    data: payload.orders.map((order) => ({
      storeId: store.id,
      type: "purchase",
      sessionId: `magento-${order.id}`,
      userId: null,
      path: "/magento-import",
      device: "server",
      country: "US",
      utmSource: "magento",
      utmMedium: "import",
      utmCampaign: "magento-backfill",
      createdAt: new Date(order.createdAt)
    }))
  });

  await prisma.auditLog.create({
    data: {
      storeId: store.id,
      action: "import",
      entity: "Magento",
      metadata: {
        orders: payload.orders.length,
        products: payload.products.length
      }
    }
  });

  console.log("Magento demo data loaded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
