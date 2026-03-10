import {
  Arg,
  FieldResolver,
  Query,
  Mutation,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { prisma } from '../db/prisma';
import { AddGenreInput, Genre } from '../models';

@Resolver(of => Genre)
export default class GenreResolver implements ResolverInterface<Genre> {
  // Field Resolvers

  @FieldResolver()
  async subGenres(@Root() genre: Genre): Promise<Genre[]> {
    return await prisma.genre.findMany({ where: { parentId: genre.id } }) as any;
  }

  // Queries

  @Query(() => [Genre])
  async fetchGenres(): Promise<Genre[]> {
    return await prisma.genre.findMany({ where: { parentId: null } }) as any;
  }

  @Query(() => [Genre])
  async fetchSubGenres(): Promise<Genre[]> {
    return await prisma.genre.findMany({
      where: { parentId: { not: null } },
    }) as any;
  }

  @Query(() => [Genre])
  async searchGenresByName(@Arg('name') name: string): Promise<Genre[]> {
    return await prisma.genre.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    }) as any;
  }

  // Mutations

  @Mutation(() => Genre)
  async addGenre(
    @Arg('genre') addGenreData: AddGenreInput
  ): Promise<Genre | null> {
    // Verify this genre name is unique
    const existingGenre = await prisma.genre.findFirst({
      where: { name: addGenreData.name },
    });
    if (existingGenre) {
      throw new Error(`Genre '${addGenreData.name}' already exists.`);
    }

    // Verify parent genre exists
    if (
      addGenreData.parentId &&
      (await prisma.genre.findUnique({ where: { id: addGenreData.parentId } })) === null
    ) {
      throw new Error(
        `No parent genre exists with ID ${addGenreData.parentId}.`
      );
    }

    try {
      return await prisma.genre.create({ data: addGenreData }) as any;
    } catch (err) {
      console.error('Failed to create new Genre.', (err as Error).message);
      return null;
    }
  }
}
