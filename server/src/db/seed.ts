import _ from 'lodash';

import { Event, Genre, Venue } from '../models';
import { eventData, genreData, subGenreData, venueData } from './seed-data';

export default async () => {

  const genres: Genre[] = await Genre.bulkCreate(genreData, { returning: true });
  const subGenres: Genre[] = await Genre.bulkCreate(subGenreData, { returning: true });
  const venues: Venue[] = await Venue.bulkCreate(venueData, { returning: true });

  const subGenreMap = _.reduce(subGenres, (dict: any, { id, parentId }) => {
    (dict[parentId!] || (dict[parentId!] = [])).push(id);
    return dict;
  }, {});

  eventData.forEach((event: Event, idx: number) => {
    event.venueId = venues[_.random(venues.length - 1)].id;
    event.genreId = genres[_.random(genres.length - 1)].id;
    // add subgenre for parent genres that have children
    if (subGenreMap[event.genreId]) {
      event.subGenreId = subGenreMap[event.genreId][_.random(subGenreMap[event.genreId].length - 1)];
    }
  });

  return await Event.bulkCreate(eventData, { returning: true });
};