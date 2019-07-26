import { Op } from 'sequelize';
import { Arg, Query, Resolver } from 'type-graphql';
import { Event, Venue } from '../models';

@Resolver(of => Venue)
export default class VenueResolver {
  @Query(returns => [Venue])
  async venues(): Promise<Venue[]> {
    return await Venue.findAll<Venue>({ include: [Event] });
  }

  @Query(returns => [Venue])
  async searchVenuesByName(@Arg('name') name: string): Promise<Venue[]> {
    return await Venue.findAll<Venue>({
      include: [Event],
      where: {
        name: {
          [Op.like]: `%${name}%`,
        }
      },
    });
  }
}
