import { Event, Venue } from './schemas';

export const events: Event[] = [
  { id: 1, name: 'Super Show 2000' },
  { id: 2, name: 'Open mic #555' },
];

export const venues: Venue[] = [
  { id: 1, name: 'Bob\s Burger Hut', state: 'WA', event_id: 1 },
  { id: 2, name: 'Longhorn Saloon', state: 'TX', event_id: 1},
  { id: 3, name: 'Hot Dog on a stick', state: 'CT', event_id: 1 },
  { id: 4, name: 'The Acropolis', state: 'OR', event_id: 2 },
  { id: 5, name: 'El Corazon', state: 'WA', event_id: 2 },
];