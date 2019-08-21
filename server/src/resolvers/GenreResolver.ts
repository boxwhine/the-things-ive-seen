import { Op } from 'sequelize';
import {
  Arg,
  FieldResolver,
  Query,
  Mutation,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { AddGenreInput, Genre } from '../models';

@Resolver(of => Genre)
export default class GenreResolver implements ResolverInterface<Genre> {

  // Field Resolvers

  @FieldResolver()
  async subGenres(@Root() genre: Genre): Promise<Genre[]> {
    return await Genre.findAll<Genre>({ where: { parentId: genre.id }});
  }

  // Queries

  @Query(() => [Genre])
  async fetchGenres(): Promise<Genre[]> {
    return await Genre.findAll<Genre>({ where: { parentId: null }});
  }

  @Query(() => [Genre])
  async fetchSubGenres(): Promise<Genre[]> {
    return await Genre.findAll<Genre>({ where: { parentId: { [Op.not]: null }}});
  }

  @Query(() => [Genre])
  async searchGenresByName(@Arg('name') name: string): Promise<Genre[]> {
    return await Genre.findAll<Genre>({ where: { name: { [Op.iLike]: `%${name}%` }}});
  }

  // Mutations

  @Mutation(() => Genre)
  async addGenre(@Arg('genre') addGenreData: AddGenreInput): Promise<Genre | null> {
    // Verify this genre name is unique
    const existingGenre = await Genre.findOne<Genre>({ where: { name: addGenreData.name }});
    if (existingGenre) {
      throw new Error(`Genre "${addGenreData.name}" already exists.`);
    }

    // Verify parent genre exists
    if (addGenreData.parentId
      && await Genre.findOne<Genre>({ where: { id: addGenreData.parentId }}) === null)
    {
      throw new Error(`No parent genre exists with ID ${addGenreData.parentId}.`);
    }

    let genre;
    try {
      genre = await Genre.create(addGenreData);
    } catch (err) {
      console.error('Failed to create new Genre.', err.message);
      return null;
    }
    return genre;
  }
}
