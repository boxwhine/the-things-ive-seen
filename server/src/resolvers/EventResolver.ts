import { Query, Resolver } from 'type-graphql';
import { Event, Genre, Venue } from '../models';

@Resolver(of => Event)
export default class EventResolver {
  @Query(() => [Event])
  async fetchEvents(): Promise<Event[]> {
    return await Event.scope('default').findAll<Event>();
  }
}
