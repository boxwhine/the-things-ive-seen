import { Op } from 'sequelize';
import { Arg, Query, Resolver } from 'type-graphql';
import { Event, Venue } from '../models';

@Resolver(of => Venue)
export default class VenueResolver {
  @Query(returns => [Venue])
  async fetchVenues(): Promise<Venue[]> {
    return await Venue.scope('default').findAll<Venue>();
  }

  @Query(returns => [Venue])
  async searchVenuesByName(@Arg('name') name: string): Promise<Venue[]> {
    return await Venue.scope('default').findAll<Venue>({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
  }
}
