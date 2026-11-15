import { describe, expect, it } from 'vitest';
import { parseItinerary } from '@/lib/parseItinerary';

describe('parseItinerary', () => {
  it('strips markdown fences and validates the itinerary payload', () => {
    const raw = `
      \`\`\`json
      {
        "destination": "Kyoto, Japan",
        "summary": "A slow, design-led trip through Kyoto.",
        "days": [
          {
            "day": 1,
            "title": "Old Quarter",
            "stops": [
              {
                "time": "09:00 AM",
                "category": "CULTURE",
                "title": "Kiyomizu-dera",
                "summary": "Temple morning walk",
                "description": "Sunrise viewpoints over the city.",
                "duration": "2 hours",
                "cost": "~$8",
                "tip": "Arrive early."
              }
            ]
          }
        ]
      }
      \`\`\`
    `;

    const parsed = parseItinerary(raw);

    expect(parsed.destination).toBe('Kyoto, Japan');
    expect(parsed.days[0].stops[0].expanded).toBe(false);
    expect(parsed.days[0].id).toBeTruthy();
  });

  it('rejects malformed JSON', () => {
    expect(() => parseItinerary('not-json')).toThrow(/invalid JSON/i);
  });
});
