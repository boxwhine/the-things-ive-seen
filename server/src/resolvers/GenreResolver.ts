import { Op } from 'sequelize';
import {
  Arg,
  FieldResolver,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { Event, Genre, Venue } from '../models';

@Resolver(of => Genre)
export default class GenreResolver implements ResolverInterface<Genre> {
  @Query(() => [Genre])
  async fetchGenres(): Promise<Genre[]> {
    return await Genre.findAll<Genre>({
      where: {
        parentId: null,
      },
    });
  }

  @Query(() => [Genre])
  async fetchSubGenres(): Promise<Genre[]> {
    return await Genre.findAll<Genre>({
      where: {
        parentId: {
          [Op.not]: null,
        },
      },
    });
  }

  @FieldResolver()
  async subGenres(@Root() genre: Genre): Promise<Genre[]> {
    return await Genre.findAll<Genre>({
      where: {
        parentId: genre.id,
      },
    });
  }

  @Query(() => [Genre])
  async searchGenresByName(@Arg('name') name: string): Promise<Genre[]> {
    return await Genre.findAll<Genre>({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
  }
}
