import { NextResponse } from 'next/server';
import { ItineraryRequestSchema } from '@/schemas/itinerary';
import { parseItinerary } from '@/lib/parseItinerary';
import {
  AIStructureError,
  AIRateLimitError,
  AITimeoutError,
  ValidationError,
  errorToResponse,
} from '@/lib/errors';

const FALLBACK_PROMPT = `Plan a realistic 3-day trip to Kyoto with a balance of culture, dining, and easy transit.`;

export function buildTripPlanPrompt(rawPrompt: string): string {
  const prompt = rawPrompt.trim();
  const normalizedPrompt = prompt || FALLBACK_PROMPT;
  const durationMatch = normalizedPrompt.match(/(\d+)\s*(day|days|night|nights|week|weeks)/i);
  const durationText = durationMatch
    ? `Keep the itinerary to exactly ${durationMatch[1]} ${durationMatch[2].toLowerCase()}${Number(durationMatch[1]) > 1 ? 's' : ''}.`
    : 'Choose a realistic and well-paced duration based on the destination and trip style.';

  return [
    'You are Wayfarer AI, an expert travel planner.',
    'Create a real, useful itinerary that matches the trip request exactly.',
    `User request: ${normalizedPrompt}`,
    durationText,
    'Return only valid JSON with this exact structure:',
    '{ destination: string, summary: string, days: [{ day: number, title: string, stops: [{ time: string, category: string, title: string, summary: string, description: string, duration: string, cost: string, tip: string }] }] }',
    'Rules:',
    '- honor the destination, trip style, and duration requested by the user',
    '- make the trip practical and specific, not generic recommendations',
    '- each day must have at least one stop, and each stop must include time, category, title, summary, description, duration, cost, and tip',
    '- avoid markdown fences and do not add extra commentary outside JSON',
  ].join('\n');
}

async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? 'gemini-3.8-flash';

  if (!apiKey || !apiKey.trim()) {
    throw new ValidationError(
      'Missing GEMINI_API_KEY. Add your Google Gemini key to .env.local and restart the app.'
    );
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildTripPlanPrompt(prompt) }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    const message = body || 'Gemini returned an invalid response.';

    if (response.status === 429) {
      throw new AIRateLimitError();
    }

    if (response.status === 400) {
      throw new AIStructureError('Gemini rejected the request schema. Check the API key, model, and payload format.');
    }

    if (response.status === 404) {
      throw new AIStructureError(
        'The configured Gemini model is unavailable. Update GEMINI_MODEL to a supported model such as gemini-3.8-flash.'
      );
    }

    if (response.status >= 500) {
      throw new AITimeoutError();
    }

    throw new AIStructureError(message);
  }

  const body = (await response.json()) as {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = body.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    throw new AIStructureError('Gemini returned an empty itinerary payload.');
  }

  return text;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ItineraryRequestSchema.parse(body);

    const raw = await callGemini(parsed.prompt || FALLBACK_PROMPT);
    const itinerary = parseItinerary(raw);

    return NextResponse.json({ itinerary });
  } catch (error) {
    const mapped = errorToResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
