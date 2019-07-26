import { Op } from 'sequelize';
import { Arg, Query, Resolver } from 'type-graphql';
import { Event, Venue } from '../models';

@Resolver(of => Event)
export default class EventResolver {
  @Query(returns => [Event])
  async events(): Promise<Event[]> {
    return await Event.findAll<Event>({ include: [Venue] });
  }

  @Query(returns => [Event])
  async searchEventsByName(@Arg('name') name: string): Promise<Event[]> {
    return await Event.findAll<Event>({
      include: [Venue],
      where: {
        name: {
          [Op.like]: `%${name}%`,
        }
      },
    });
  }
}
