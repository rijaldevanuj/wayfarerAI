import { z } from 'zod';

// ─── Request Schema ───────────────────────────────────────────────────────────
export const ItineraryRequestSchema = z.object({
  prompt: z
    .string()
    .min(3, 'Prompt must be at least 3 characters')
    .max(500, 'Prompt must be 500 characters or fewer'),
});

export type ItineraryRequest = z.infer<typeof ItineraryRequestSchema>;

// ─── Raw LLM Response Schema (what Gemini returns) ────────────────────────────
export const RawStopSchema = z.object({
  time: z.string(),
  category: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  cost: z.string().optional().default(''),
  tip: z.string().optional().default(''),
});

export const RawDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  stops: z.array(RawStopSchema).min(1, 'Each day must have at least one stop'),
});

export const RawItinerarySchema = z.object({
  destination: z.string(),
  summary: z.string(),
  days: z.array(RawDaySchema).min(1, 'Itinerary must have at least one day'),
});

export type RawItinerary = z.infer<typeof RawItinerarySchema>;
export type RawDay = z.infer<typeof RawDaySchema>;
export type RawStop = z.infer<typeof RawStopSchema>;

// ─── Hydrated Client Schema (with UUIDs for React keys + interaction) ─────────
export const HydratedStopSchema = RawStopSchema.extend({
  id: z.string().uuid(),
  expanded: z.boolean().default(false),
});

export const HydratedDaySchema = RawDaySchema.extend({
  id: z.string().uuid(),
  stops: z.array(HydratedStopSchema),
});

export const HydratedItinerarySchema = RawItinerarySchema.extend({
  days: z.array(HydratedDaySchema),
});

export type HydratedStop = z.infer<typeof HydratedStopSchema>;
export type HydratedDay = z.infer<typeof HydratedDaySchema>;
export type HydratedItinerary = z.infer<typeof HydratedItinerarySchema>;

// ─── Trip Persistence Schema ──────────────────────────────────────────────────
export const SaveTripRequestSchema = z.object({
  prompt: z.string(),
  destination: z.string(),
  summary: z.string(),
  itinerary: HydratedItinerarySchema,
});

export const UpdateTripRequestSchema = z.object({
  itinerary: HydratedItinerarySchema,
});

export type SaveTripRequest = z.infer<typeof SaveTripRequestSchema>;
export type UpdateTripRequest = z.infer<typeof UpdateTripRequestSchema>;

// ─── Saved Trip (from DB) ─────────────────────────────────────────────────────
export interface SavedTrip {
  id: string;
  user_id: string;
  prompt: string;
  destination: string;
  summary: string;
  itinerary: HydratedItinerary;
  created_at: string;
  updated_at: string;
}
