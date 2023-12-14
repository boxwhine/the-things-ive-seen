import { Op } from 'sequelize';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AddVenueInput, Venue } from '../models';

@Resolver(of => Venue)
export default class VenueResolver {

  // Queries

  @Query(() => [Venue])
  async fetchVenues(): Promise<Venue[]> {
    return await Venue.scope('default').findAll<Venue>();
  }

  @Query(() => [Venue])
  async searchVenuesByName(@Arg('name') name: string): Promise<Venue[]> {
    return await Venue.scope('default').findAll<Venue>({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
  }

  // Mutations

  @Mutation(() => Venue)
  async addVenue(@Arg('venue') addVenueData: AddVenueInput): Promise<Venue | null> {
    // Verify this venue hasn't already been defined (just use name, city state for now)
    const existingVenue = await Venue.findOne<Venue>({ where: {
      name: addVenueData.name,
      city: addVenueData.city,
      state: addVenueData.state
    }});
    if (existingVenue) {
      throw new Error(`Venue '${addVenueData.name}' in ${addVenueData.city}, ${addVenueData.state}, already exists.`);
    }

    let venue;
    try {
      venue = await Venue.create(addVenueData);
    } catch (err) {
      console.error('Failed to create new Venue.', err.message);
      return null;
    }
    return venue;
  }
}
