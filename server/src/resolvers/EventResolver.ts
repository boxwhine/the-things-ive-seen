import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Event, Venue } from '../schemas';
import { events, venues } from '../data';

@Resolver(of => Event)
export default class EventResolver {
  @Query(returns => [Event])
  fetchEvents(): Event[] {
    return events;
  }

  @Query(returns => Event, { nullable: true })
  eventByName(@Arg('name') name: string): Event | undefined {
    return events.find(event => event.name === name);
  }

  @Query(returns => Event, { nullable: true })
  searchByName(@Arg('name') name: string): Event[] | undefined {
    return events.filter(event => event.name.includes(name));
  }

  @FieldResolver()
  venue(@Root() event: Event): Venue | undefined {
    return venues.find(venue => venue.event_id === event.id);
  }
}
