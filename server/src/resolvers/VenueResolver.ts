import { Arg, FieldResolver, Query, Resolver, Mutation, Root } from 'type-graphql';
import { Event, Venue } from '../schemas';
import { events, venues } from '../data';

@Resolver(of => Venue)
export default class VenueResolver {
  @Query(returns => [Venue])
  fetchVenues(): Venue[] {
    return venues;
  }

  @Query(returns => Venue, { nullable: true })
  getVenue(@Arg('id') id: number): Venue | undefined {
    return venues.find(venue => venue.id === id);
  }

  @Query(returns => Venue, { nullable: true })
  venueByName(@Arg('name') name: string): Venue | undefined {
    return venues.find(venue => venue.name === name);
  }

  // @FieldResolver()
  // events(@Root() venue: Venue): Event[] | [] {
  //   return events.filter(event => event.id === venue.event_id);
  // }
}
