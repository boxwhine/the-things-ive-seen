import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { prisma } from "../db/prisma";
import { AddVenueInput, Venue } from "../models";

@Resolver((of) => Venue)
export default class VenueResolver {
  // Queries

  @Query(() => [Venue])
  async fetchVenues(): Promise<Venue[]> {
    return (await prisma.venue.findMany({ include: { events: true } })) as any;
  }

  @Query(() => [Venue])
  async searchVenuesByName(@Arg("name") name: string): Promise<Venue[]> {
    return (await prisma.venue.findMany({
      where: { name: { contains: name, mode: "insensitive" } },
      include: { events: true },
    })) as any;
  }

  // Mutations

  @Mutation(() => Venue)
  async addVenue(
    @Arg("venue") addVenueData: AddVenueInput,
  ): Promise<Venue | null> {
    // Verify this venue hasn't already been defined (just use name, city state for now)
    const existingVenue = await prisma.venue.findFirst({
      where: {
        name: addVenueData.name,
        city: addVenueData.city,
        state: addVenueData.state,
      },
    });
    if (existingVenue) {
      throw new Error(
        `Venue '${addVenueData.name}' in ${addVenueData.city}, ${addVenueData.state}, already exists.`,
      );
    }

    try {
      return (await prisma.venue.create({ data: addVenueData })) as any;
    } catch (err) {
      console.error("Failed to create new Venue.", (err as Error).message);
      return null;
    }
  }
}
