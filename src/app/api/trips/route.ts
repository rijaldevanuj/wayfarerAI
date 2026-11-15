import { NextResponse } from 'next/server';
import { SaveTripRequestSchema } from '@/schemas/itinerary';
import { createClient } from '@/lib/supabase/server';

async function getAuthedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return { supabase, user: data.user };
}

export async function GET() {
  const session = await getAuthedUser();

  if (!session) {
    return NextResponse.json({ error: 'Authentication required', code: 'AUTH_REQUIRED' }, { status: 401 });
  }

  const { data, error } = await session.supabase
    .from('trips')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message, code: 'DB_ERROR' }, { status: 500 });
  }

  return NextResponse.json({ trips: data ?? [] });
}

export async function POST(request: Request) {
  const session = await getAuthedUser();

  if (!session) {
    return NextResponse.json({ error: 'Authentication required', code: 'AUTH_REQUIRED' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = SaveTripRequestSchema.parse(body);

    const { data, error } = await session.supabase
      .from('trips')
      .insert({
        user_id: session.user.id,
        prompt: parsed.prompt,
        destination: parsed.destination,
        summary: parsed.summary,
        itinerary: parsed.itinerary,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message, code: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ trip: data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Invalid request', code: 'VALIDATION_ERROR' }, { status: 400 });
  }
}
