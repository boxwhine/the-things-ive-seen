import { Mutation, Query, Resolver, Arg } from 'type-graphql';
import { Event, AddEventInput } from '../models';

@Resolver(of => Event)
export default class EventResolver {

  // Queries

  @Query(() => [Event])
  async fetchEvents(): Promise<Event[]> {
    return await Event.scope('default').findAll<Event>();
  }

  // Mutations

  @Mutation(() => Event)
  async addEvent(@Arg('event') addEventData: AddEventInput): Promise<Event | null> {
    let event;
    try {
      // @TODO see if we can set 'include' options for create to avoid follow-up findOne call
      event = await Event.create(addEventData);
    } catch (err) {
      console.error('Failed to create new Event.', err.message);
      return null;
    }
    return await Event.scope('default').findOne({ where: { id: event.get('id') } });
  }

}
