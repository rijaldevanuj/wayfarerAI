'use client';

import Link from 'next/link';
import { useEffect, useReducer, useState } from 'react';
import type { HydratedItinerary } from '@/schemas/itinerary';
import { itineraryReducer, initialState } from '@/state/itineraryReducer';

const presetPrompts = [
  'Honeymoon in Bali with slow luxury, beach clubs, and private dinners',
  'Safari in Kenya with sunrise game drives and a cinematic lodge stay',
  'Small-group wine route through Patagonia with scenic hikes and warm local meals',
  'Culture-first week in Kyoto with temples, tea houses, and hidden design shops',
];

export default function PlannerPage() {
  const [state, dispatch] = useReducer(itineraryReducer, initialState);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const submitPrompt = async (promptOverride?: string) => {
    const nextPrompt = (promptOverride ?? state.prompt).trim();

    if (!nextPrompt) {
      dispatch({
        type: 'FETCH_ERROR',
        error: 'Please tell Wayfarer AI where you would like to go.',
        code: 'VALIDATION_ERROR',
      });
      return;
    }

    dispatch({ type: 'SET_PROMPT', prompt: nextPrompt });
    dispatch({ type: 'FETCH_START' });

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: nextPrompt,
        }),
      });

      const body = (await response.json()) as {
        itinerary?: HydratedItinerary;
        error?: string;
        code?: string;
      };

      if (!response.ok || !body.itinerary) {
        dispatch({
          type: 'FETCH_ERROR',
          error: body.error || 'Something went wrong while planning your trip.',
          code: body.code || 'UNKNOWN_ERROR',
        });
        return;
      }

      dispatch({
        type: 'FETCH_SUCCESS',
        itinerary: body.itinerary,
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_ERROR',
        error: error instanceof Error ? error.message : 'Unable to generate the itinerary.',
        code: 'NETWORK_ERROR',
      });
    }
  };

  const saveTrip = async () => {
    if (!state.itinerary) {
      return;
    }

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: state.prompt,
          destination: state.itinerary.destination,
          summary: state.itinerary.summary,
          itinerary: state.itinerary,
        }),
      });

      const body = (await response.json()) as { trip?: { id: string }; error?: string; code?: string };

      if (!response.ok) {
        window.alert(body.error || 'Sign in to save trips.');
        return;
      }

      if (body.trip?.id) {
        dispatch({ type: 'SET_SAVED_TRIP_ID', id: body.trip.id });
      }
    } catch {
      window.alert('Unable to save this trip right now.');
    }
  };

  const removeStop = (dayId: string, stopId: string) => {
    dispatch({ type: 'REMOVE_STOP', dayId, stopId });
    setToast('Stop removed — Undo');
  };

  const undoLastStop = () => {
    dispatch({ type: 'UNDO_REMOVE' });
    setToast('Removed stop restored');
  };

  return (
    <div className="min-h-screen bg-[#0B1F2A] text-[#F5EFE6]">
      <header className="sticky top-0 z-40 border-b border-[#1E3A4A] bg-[#0B1F2A]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#FF7A45]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FF7A45]/60 bg-[#102937] text-lg">✦</span>
            <div>
              <div>Wayfarer</div>
              <div className="text-[10px] text-[#9FB1BC]">AI</div>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-[#9FB1BC] md:flex">
            <button type="button" className="transition hover:text-[#F5EFE6]">My trips</button>
            <button type="button" className="transition hover:text-[#F5EFE6]">New session</button>
            <Link href="/auth" className="transition hover:text-[#F5EFE6]">Sign in</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#FF7A45]">Wayfarer AI</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Plan your journey, in conversation.
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
            <button type="button" className="rounded-full border border-[#1E3A4A] bg-[#102937] px-4 py-2 text-[#F5EFE6]">
              My trips
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESET' })}
              className="rounded-full border border-[#1E3A4A] bg-[#102937] px-4 py-2 text-[#F5EFE6]"
            >
              New session
            </button>
            <Link href="/auth" className="rounded-full border border-[#FF7A45]/40 bg-[#FF7A45]/10 px-4 py-2 text-[#FF7A45]">
              Sign in
            </Link>
          </div>
        </div>

        {state.status === 'idle' && (
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#FF7A45]/60 bg-[#FF7A45]/10 text-2xl text-[#FF7A45]">
                ✦
              </div>
              <h2 className="text-4xl font-black tracking-tight text-[#F5EFE6]">Where shall we begin?</h2>
              <p className="mt-3 max-w-xl text-base text-[#9FB1BC]">
                Start with a mood, a destination, or a travel rhythm — and let Wayfarer shape a plan around the way you move.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {presetPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitPrompt(prompt)}
                  className="group rounded-[24px] border border-[#1E3A4A] bg-[#102937] p-5 text-left transition hover:-translate-y-0.5 hover:border-[#FF7A45]"
                >
                  <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#FF7A45]">
                    {prompt.split(' ')[0].toUpperCase()}
                  </div>
                  <div className="min-h-[96px] text-lg font-semibold tracking-tight text-[#F5EFE6]">
                    {prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {state.status === 'loading' && (
          <div className="space-y-4">
            {[1, 2, 3].map((day) => (
              <div key={day} className="rounded-[24px] border border-[#1E3A4A] bg-[#102937] p-5">
                <div className="h-4 w-24 animate-pulse rounded-full bg-[#1E3A4A]" />
                <div className="mt-5 space-y-3">
                  {[1, 2].map((stop) => (
                    <div key={stop} className="rounded-2xl border border-[#1E3A4A] p-4">
                      <div className="h-3 w-20 animate-pulse rounded-full bg-[#1E3A4A]" />
                      <div className="mt-3 h-5 w-56 animate-pulse rounded-full bg-[#1E3A4A]" />
                      <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-[#1E3A4A]" />
                      <div className="mt-2 h-3 w-5/6 animate-pulse rounded-full bg-[#1E3A4A]" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {state.status === 'error' && state.error && (
          <div className="rounded-[28px] border border-[#FF7A45]/60 bg-[#102937] p-6 shadow-xl shadow-black/20">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#FF7A45]">Generation issue</div>
            <h3 className="text-2xl font-black tracking-tight text-[#F5EFE6]">Your itinerary needs a quick retry.</h3>
            <p className="mt-3 max-w-2xl text-[#D8E1E8]">{state.error}</p>
            <button
              type="button"
              onClick={() => submitPrompt(state.prompt)}
              className="mt-5 rounded-full bg-[#FF7A45] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0B1F2A]"
            >
              Retry generation ↗
            </button>
          </div>
        )}

        {state.status === 'success' && state.itinerary && (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[28px] border border-[#1E3A4A] bg-[#102937]">
              <div className="flex flex-col gap-4 border-b border-[#1E3A4A] bg-[radial-gradient(circle_at_top_left,#1D3D52,#102937_55%)] p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#FF7A45]">Destination</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{state.itinerary.destination}</h2>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
                  <span className="rounded-full border border-[#1E3A4A] bg-[#0B1F2A] px-3 py-2 text-[#9FB1BC]">
                    {state.itinerary.days.length} days
                  </span>
                  <span className="rounded-full border border-[#1E3A4A] bg-[#0B1F2A] px-3 py-2 text-[#9FB1BC]">
                    {state.itinerary.days.reduce((count, day) => count + day.stops.length, 0)} stops
                  </span>
                  <button
                    type="button"
                    onClick={saveTrip}
                    className="rounded-full bg-[#FF7A45] px-4 py-2 text-[#0B1F2A]"
                  >
                    {state.savedTripId ? 'Saved ✓' : 'Save trip'}
                  </button>
                </div>
              </div>

              <div className="p-6 text-[#D8E1E8]">{state.itinerary.summary}</div>
            </section>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {state.itinerary.days.map((day, index) => (
                <button
                  key={day.id}
                  type="button"
                  className="rounded-full border border-[#1E3A4A] bg-[#102937] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#F5EFE6]"
                >
                  Day {index + 1}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {state.itinerary.days.map((day, dayIndex) => (
                <section key={day.id} className="rounded-[24px] border border-[#1E3A4A] bg-[#102937] p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#FF7A45]">
                      {String(dayIndex + 1).padStart(2, '0')} / Day {dayIndex + 1}
                    </span>
                    <h3 className="text-xl font-black tracking-tight text-white">{day.title}</h3>
                  </div>

                  <div className="space-y-3">
                    {day.stops.map((stop, stopIndex) => (
                      <article key={stop.id} className="rounded-[20px] border border-[#1E3A4A] bg-[#0B1F2A] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#9FB1BC]">
                              <span>{stop.time}</span>
                              <span className="rounded-full border border-[#1E3A4A] bg-[#102937] px-2 py-1 text-[#FF7A45]">
                                {stop.category}
                              </span>
                            </div>
                            <h4 className="mt-3 text-lg font-bold text-[#F5EFE6]">{stop.title}</h4>
                            <p className="mt-2 text-sm text-[#D8E1E8]">{stop.summary}</p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => dispatch({ type: 'REORDER_STOP', dayId: day.id, stopId: stop.id, direction: 'up' })}
                              disabled={stopIndex === 0}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1E3A4A] text-lg text-[#F5EFE6] disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={`Move ${stop.title} earlier`}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => dispatch({ type: 'REORDER_STOP', dayId: day.id, stopId: stop.id, direction: 'down' })}
                              disabled={stopIndex === day.stops.length - 1}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1E3A4A] text-lg text-[#F5EFE6] disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={`Move ${stop.title} later`}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => removeStop(day.id, stop.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1E3A4A] text-lg text-[#F5EFE6]"
                              aria-label={`Remove ${stop.title}`}
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => dispatch({ type: 'TOGGLE_STOP', dayId: day.id, stopId: stop.id })}
                            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#FF7A45]"
                          >
                            {stop.expanded ? 'Hide details' : 'View details'} {stop.expanded ? '⌃' : '⌄'}
                          </button>
                        </div>

                        {stop.expanded && (
                          <div className="mt-4 rounded-2xl border border-[#1E3A4A] bg-[#102937] p-4 text-sm text-[#D8E1E8]">
                            <p>{stop.description || 'No additional description provided.'}</p>
                            <div className="mt-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.18em] text-[#9FB1BC]">
                              <span>Duration: {stop.duration || 'Flexible'}</span>
                              <span>Cost: {stop.cost || 'Flexible'}</span>
                            </div>
                            <p className="mt-3 text-[#F5EFE6]">Insider tip: {stop.tip || 'Keep your itinerary flexible to leave room for discoveries.'}</p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[26px] border border-[#1E3A4A] bg-[#0F2430]/95 p-3 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={state.prompt}
              onChange={(event) => dispatch({ type: 'SET_PROMPT', prompt: event.target.value })}
              placeholder="Tell Wayfarer AI where you'd love to go..."
              className="h-12 flex-1 rounded-full border border-[#1E3A4A] bg-[#102937] px-4 text-sm text-[#F5EFE6] placeholder:text-[#9FB1BC] outline-none transition focus:border-[#FF7A45]"
            />

            <button
              type="button"
              onClick={() => submitPrompt()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF7A45] text-2xl text-[#0B1F2A]"
              aria-label="Generate itinerary"
            >
              ↑
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed right-5 top-24 rounded-full border border-[#FF7A45] bg-[#102937] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#F5EFE6] shadow-lg shadow-black/30">
          {toast}
        </div>
      )}

      {state.undoStack.length > 0 && (
        <button
          type="button"
          onClick={undoLastStop}
          className="fixed left-5 top-24 rounded-full border border-[#1E3A4A] bg-[#102937] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#F5EFE6]"
        >
          Undo
        </button>
      )}
    </div>
  );
}
