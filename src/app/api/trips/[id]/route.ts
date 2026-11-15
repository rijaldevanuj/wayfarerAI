import { NextResponse } from 'next/server';
import { UpdateTripRequestSchema } from '@/schemas/itinerary';
import { createClient } from '@/lib/supabase/server';

async function getAuthedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return { supabase, user: data.user };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthedUser();

  if (!session) {
    return NextResponse.json({ error: 'Authentication required', code: 'AUTH_REQUIRED' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = UpdateTripRequestSchema.parse(body);

    const { error } = await session.supabase
      .from('trips')
      .update({ itinerary: parsed.itinerary, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      return NextResponse.json({ error: error.message, code: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Invalid request', code: 'VALIDATION_ERROR' }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthedUser();

  if (!session) {
    return NextResponse.json({ error: 'Authentication required', code: 'AUTH_REQUIRED' }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await session.supabase
    .from('trips')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message, code: 'DB_ERROR' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
