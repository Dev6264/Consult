import { prisma } from "../lib/prisma";
import { generatePlaceholderMedia, generateProgramPdf } from "../lib/utils";
import { logAudit } from "../lib/audit";

async function main() {
  const existing = await prisma.case.findFirst();
  if (existing) return;

  const caseRecord = await prisma.case.create({
    data: {
      slug: "aisha-odhiambo",
      package: "standard",
      status: "pending_verification",
      consentAttestation: true,
      privacy: "public",
      noindex: true,
      organizer: {
        create: {
          fullName: "Samwel Odhiambo",
          phoneE164: "+254712345678",
          relation: "Brother"
        }
      },
      deceased: {
        create: {
          fullName: "Aisha Odhiambo",
          dob: "1985-02-14",
          dod: "2025-09-05",
          faith: "christian",
          shortBio: "Aisha was a beloved teacher and community volunteer whose warmth touched everyone." 
        }
      },
      events: {
        create: [
          {
            type: "vigil",
            startIso: "2025-09-06T18:00:00+03:00",
            venue: "Family Residence",
            address: "Kilimani, Nairobi",
            mapUrl: "https://maps.google.com/?q=Kilimani+Nairobi",
            lat: -1.2921,
            lng: 36.8219
          }
        ]
      }
    }
  });

  await prisma.copyDeck.create({
    data: {
      caseId: caseRecord.id,
      copyShortEn: "We celebrate the life of Aisha Odhiambo. Join us in remembrance.",
      copyShortSw: "Tunaadhimisha maisha ya Aisha Odhiambo. Karibuni tumkumbuke pamoja.",
      copyLong: "Aisha was known for her generosity and kindness. We invite friends and family to gather as we honour her legacy.",
      radio15: "We remember Aisha Odhiambo. Join us this weekend to celebrate her life.",
      radio30: "The Odhiambo family invites you to a service of thanksgiving for Aisha Odhiambo. Details are available on the memorial page."
    }
  });

  const media = await generatePlaceholderMedia(caseRecord.id);
  const publicUrl = `http://localhost:3000/cases/${caseRecord.slug}`;
  const programPdfUrl = await generateProgramPdf(caseRecord.id, publicUrl);

  await prisma.media.create({
    data: {
      caseId: caseRecord.id,
      ...media,
      programPdfUrl
    }
  });

  await logAudit(caseRecord.id, "seed", { note: "Seed case created" });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
