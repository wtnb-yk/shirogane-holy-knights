import { Event } from '../types';

export const sortEventsByTime = (events: Event[]): Event[] => {
  return [...events].sort((a, b) => {
    if (a.eventTime && b.eventTime) {
      return a.eventTime.localeCompare(b.eventTime);
    }
    if (a.eventTime) return -1;
    if (b.eventTime) return 1;
    return 0;
  });
};