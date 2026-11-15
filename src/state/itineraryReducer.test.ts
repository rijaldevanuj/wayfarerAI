import { describe, expect, it } from 'vitest';
import { itineraryReducer, initialState } from '@/state/itineraryReducer';

const sampleItinerary = {
  destination: 'Kyoto, Japan',
  summary: 'A calm design route through Kyoto.',
  days: [
    {
      id: 'day-1',
      day: 1,
      title: 'Arrival',
      stops: [
        {
          id: 'stop-1',
          time: '09:00 AM',
          category: 'CULTURE',
          title: 'Temple walk',
          summary: 'Visit the temple district.',
          description: 'A slow start to the day.',
          duration: '2 hours',
          cost: 'Free',
          tip: 'Do it before breakfast crowds build.',
          expanded: false,
        },
        {
          id: 'stop-2',
          time: '13:00 PM',
          category: 'DINING',
          title: 'Lunch spot',
          summary: 'A calm lunch room.',
          description: 'An intimate wood-panelled dining room.',
          duration: '1 hour',
          cost: '~$25',
          tip: 'Ask for the seasonal set.',
          expanded: false,
        },
      ],
    },
  ],
};

describe('itineraryReducer', () => {
  it('reorders within bounds and removes stops with undo support', () => {
    const first = itineraryReducer(
      { ...initialState, itinerary: sampleItinerary },
      { type: 'REORDER_STOP', dayId: 'day-1', stopId: 'stop-2', direction: 'up' }
    );

    expect(first.itinerary?.days[0].stops[0].id).toBe('stop-2');

    const second = itineraryReducer(first, { type: 'REMOVE_STOP', dayId: 'day-1', stopId: 'stop-2' });
    expect(second.itinerary?.days[0].stops).toHaveLength(1);
    expect(second.undoStack).toHaveLength(1);

    const third = itineraryReducer(second, { type: 'UNDO_REMOVE' });
    expect(third.itinerary?.days[0].stops).toHaveLength(2);
  });

  it('resets state cleanly', () => {
    const next = itineraryReducer(
      { ...initialState, status: 'success', prompt: 'hello' },
      { type: 'RESET' }
    );

    expect(next.status).toBe('idle');
    expect(next.prompt).toBe('');
  });
});
