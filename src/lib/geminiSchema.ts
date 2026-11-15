/**
 * JSON Schema passed to Gemini's generationConfig.responseSchema
 * to enforce structured itinerary output from the model.
 */
export const geminiItinerarySchema = {
  type: 'OBJECT' as const,
  properties: {
    destination: {
      type: 'STRING' as const,
      description: 'The main destination or trip title',
    },
    summary: {
      type: 'STRING' as const,
      description: 'A 2-3 sentence editorial summary of the trip',
    },
    days: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          day: {
            type: 'INTEGER' as const,
            description: 'Day number (1-indexed)',
          },
          title: {
            type: 'STRING' as const,
            description:
              'Editorial day title, e.g., "Arrival & Old Quarter"',
          },
          stops: {
            type: 'ARRAY' as const,
            items: {
              type: 'OBJECT' as const,
              properties: {
                time: {
                  type: 'STRING' as const,
                  description: 'Time slot, e.g., "09:00 AM"',
                },
                category: {
                  type: 'STRING' as const,
                  description:
                    'Category tag in uppercase, e.g., CULTURE, DINING, ADVENTURE, NATURE, TRANSPORT',
                },
                title: {
                  type: 'STRING' as const,
                  description: 'Name of the stop or activity',
                },
                summary: {
                  type: 'STRING' as const,
                  description: 'One-line summary visible in collapsed view',
                },
                description: {
                  type: 'STRING' as const,
                  description: 'Detailed description shown on expand',
                },
                duration: {
                  type: 'STRING' as const,
                  description: 'Estimated duration, e.g., "2 hours"',
                },
                cost: {
                  type: 'STRING' as const,
                  description:
                    'Cost note, e.g., "~$15 entry" or "Free"',
                },
                tip: {
                  type: 'STRING' as const,
                  description: 'Insider tip for this stop',
                },
              },
              required: ['time', 'category', 'title', 'summary'],
            },
          },
        },
        required: ['day', 'title', 'stops'],
      },
    },
  },
  required: ['destination', 'summary', 'days'],
};
