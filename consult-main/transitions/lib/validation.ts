import { z } from "zod";

const kenyaPhoneRegex = /^\+254\d{9}$/;
const mapAllowlist = ["maps.google.com", "google.com/maps", "goo.gl/maps", "maps.app.goo.gl"];

const mapUrlSchema = z
  .string()
  .url()
  .refine((value) => {
    try {
      const parsed = new URL(value);
      const hostAndPath = `${parsed.host}${parsed.pathname}`;
      return mapAllowlist.some((allowed) => hostAndPath.includes(allowed) || parsed.host.includes(allowed));
    } catch {
      return false;
    }
  }, "Map URL must be a Google Maps link");

export const organizerSchema = z.object({
  fullName: z.string().min(2),
  phoneE164: z.string().regex(kenyaPhoneRegex, "Use Kenya phone format (+2547XXXXXXXX)"),
  relation: z.string().min(2)
});

export const deceasedSchema = z.object({
  fullName: z.string().min(2),
  dob: z.string().optional().nullable(),
  dod: z.string().min(4),
  faith: z.enum(["christian", "muslim", "hindu", "interfaith", "neutral"]),
  shortBio: z.string().min(10)
});

export const eventSchema = z.object({
  type: z.enum(["vigil", "service", "burial"]),
  startIso: z.string().datetime({ offset: true }),
  venue: z.string().min(2),
  address: z.string().optional().nullable(),
  mapUrl: mapUrlSchema,
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable()
});

export const rsvpSchema = z.object({
  name: z.string().optional().nullable(),
  phone: z.string().regex(kenyaPhoneRegex, "Use Kenya phone format (+2547XXXXXXXX)").optional().nullable(),
  status: z.enum(["yes", "no", "maybe"]),
  headcount: z.number().int().min(1).max(100)
});

export const caseCreateSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  package: z.enum(["announcement", "standard", "premium", "corporate"]),
  consentAttestation: z.literal(true),
  privacy: z.enum(["public", "invite"]),
  noindex: z.boolean(),
  organizer: organizerSchema,
  deceased: deceasedSchema,
  events: z.array(eventSchema).min(1),
  copyShortEn: z.string().min(8),
  copyShortSw: z.string().min(8),
  copyLong: z.string().min(20),
  radio15: z.string().min(8),
  radio30: z.string().min(8)
});

export const publishRequirements = z.object({
  consentAttestation: z.literal(true),
  deceasedName: z.string().min(2),
  dod: z.string().min(4),
  hasEvent: z.literal(true),
  hasImage: z.literal(true)
});
