import { Event, Venue } from '../models';
import { eventData, venueData } from './seed-data';

export default async () => {
  const venues = await Venue.bulkCreate(venueData, { returning: true });
  const events = await Event.bulkCreate(eventData, { returning: true });

  // console.log('venues?', venues[0].toJSON());
  // console.log('event?', events[0].toJSON());
};