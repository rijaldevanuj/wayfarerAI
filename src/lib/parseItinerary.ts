import { RawItinerarySchema, type HydratedItinerary } from '@/schemas/itinerary';

const createId = () => {
  if (globalThis.crypto && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  return `wayfarer-${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Pure function: takes raw Gemini response text →
 *   1. Strips markdown code fences (```json ... ```)
 *   2. JSON.parse
 *   3. Zod safeParse against RawItinerarySchema
 *   4. Hydrates with client-side UUIDs for React keys + interaction state
 *
 * Throws descriptive errors on any step failure.
 */
export function parseItinerary(raw: string): HydratedItinerary {
  // Step 1: Strip markdown fences if present
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Step 2: JSON parse
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `AI returned invalid JSON: ${cleaned.slice(0, 120)}...`
    );
  }

  // Step 3: Zod validation
  const result = RawItinerarySchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`AI returned invalid structure: ${issues}`);
  }

  // Step 4: Hydrate with UUIDs
  const validated = result.data;
  const hydrated: HydratedItinerary = {
    ...validated,
    days: validated.days.map((day) => ({
      ...day,
      id: createId(),
      stops: day.stops.map((stop) => ({
        ...stop,
        id: createId(),
        expanded: false,
      })),
    })),
  };

  return hydrated;
}
