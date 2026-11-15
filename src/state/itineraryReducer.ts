import type { HydratedItinerary, HydratedDay, HydratedStop } from '@/schemas/itinerary';

// ─── State ────────────────────────────────────────────────────────────────────
export type ItineraryStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ItineraryState {
  status: ItineraryStatus;
  prompt: string;
  itinerary: HydratedItinerary | null;
  error: string | null;
  errorCode: string | null;
  /** Stack for undo support (last removed stop) */
  undoStack: { dayId: string; index: number; stop: HydratedStop }[];
  /** Trip persistence */
  savedTripId: string | null;
}

export const initialState: ItineraryState = {
  status: 'idle',
  prompt: '',
  itinerary: null,
  error: null,
  errorCode: null,
  undoStack: [],
  savedTripId: null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────
export type ItineraryAction =
  | { type: 'SET_PROMPT'; prompt: string }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; itinerary: HydratedItinerary }
  | { type: 'FETCH_ERROR'; error: string; code?: string }
  | { type: 'RESET' }
  | { type: 'TOGGLE_STOP'; dayId: string; stopId: string }
  | { type: 'REMOVE_STOP'; dayId: string; stopId: string }
  | { type: 'UNDO_REMOVE' }
  | { type: 'REORDER_STOP'; dayId: string; stopId: string; direction: 'up' | 'down' }
  | { type: 'SET_SAVED_TRIP_ID'; id: string }
  | { type: 'LOAD_TRIP'; prompt: string; itinerary: HydratedItinerary; tripId: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function mapDays(
  days: HydratedDay[],
  dayId: string,
  fn: (day: HydratedDay) => HydratedDay
): HydratedDay[] {
  return days.map((d) => (d.id === dayId ? fn(d) : d));
}

function mapStops(
  stops: HydratedStop[],
  stopId: string,
  fn: (stop: HydratedStop) => HydratedStop
): HydratedStop[] {
  return stops.map((s) => (s.id === stopId ? fn(s) : s));
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
export function itineraryReducer(
  state: ItineraryState,
  action: ItineraryAction
): ItineraryState {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, prompt: action.prompt };

    case 'FETCH_START':
      return {
        ...state,
        status: 'loading',
        error: null,
        errorCode: null,
        itinerary: null,
        undoStack: [],
        savedTripId: null,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        status: 'success',
        itinerary: action.itinerary,
        error: null,
        errorCode: null,
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.error,
        errorCode: action.code ?? null,
      };

    case 'RESET':
      return { ...initialState };

    case 'TOGGLE_STOP': {
      if (!state.itinerary) return state;
      return {
        ...state,
        itinerary: {
          ...state.itinerary,
          days: mapDays(state.itinerary.days, action.dayId, (day) => ({
            ...day,
            stops: mapStops(day.stops, action.stopId, (stop) => ({
              ...stop,
              expanded: !stop.expanded,
            })),
          })),
        },
      };
    }

    case 'REMOVE_STOP': {
      if (!state.itinerary) return state;
      const day = state.itinerary.days.find((d) => d.id === action.dayId);
      if (!day) return state;
      const stopIndex = day.stops.findIndex((s) => s.id === action.stopId);
      if (stopIndex === -1) return state;
      const removedStop = day.stops[stopIndex];

      return {
        ...state,
        undoStack: [
          ...state.undoStack,
          { dayId: action.dayId, index: stopIndex, stop: removedStop },
        ],
        itinerary: {
          ...state.itinerary,
          days: mapDays(state.itinerary.days, action.dayId, (d) => ({
            ...d,
            stops: d.stops.filter((s) => s.id !== action.stopId),
          })),
        },
      };
    }

    case 'UNDO_REMOVE': {
      if (!state.itinerary || state.undoStack.length === 0) return state;
      const lastUndo = state.undoStack[state.undoStack.length - 1];

      return {
        ...state,
        undoStack: state.undoStack.slice(0, -1),
        itinerary: {
          ...state.itinerary,
          days: mapDays(state.itinerary.days, lastUndo.dayId, (day) => {
            const newStops = [...day.stops];
            newStops.splice(lastUndo.index, 0, lastUndo.stop);
            return { ...day, stops: newStops };
          }),
        },
      };
    }

    case 'REORDER_STOP': {
      if (!state.itinerary) return state;
      return {
        ...state,
        itinerary: {
          ...state.itinerary,
          days: mapDays(state.itinerary.days, action.dayId, (day) => {
            const idx = day.stops.findIndex((s) => s.id === action.stopId);
            if (idx === -1) return day;
            const newIdx = action.direction === 'up' ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= day.stops.length) return day;
            const newStops = [...day.stops];
            [newStops[idx], newStops[newIdx]] = [newStops[newIdx], newStops[idx]];
            return { ...day, stops: newStops };
          }),
        },
      };
    }

    case 'SET_SAVED_TRIP_ID':
      return { ...state, savedTripId: action.id };

    case 'LOAD_TRIP':
      return {
        ...state,
        status: 'success',
        prompt: action.prompt,
        itinerary: action.itinerary,
        savedTripId: action.tripId,
        error: null,
        errorCode: null,
        undoStack: [],
      };

    default:
      return state;
  }
}
