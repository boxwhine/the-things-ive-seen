import { Mutation, Query, Resolver, Arg } from "type-graphql";
import { prisma } from "../db/prisma";
import { Event, AddEventInput } from "../models";

const eventIncludes = { venue: true, genre: true, subGenre: true };

@Resolver((of) => Event)
export default class EventResolver {
  // Queries

  @Query(() => [Event])
  async fetchEvents(): Promise<Event[]> {
    return (await prisma.event.findMany({ include: eventIncludes })) as any;
  }

  // Mutations

  @Mutation(() => Event)
  async addEvent(
    @Arg("event") addEventData: AddEventInput,
  ): Promise<Event | null> {
    try {
      return (await prisma.event.create({
        data: addEventData,
        include: eventIncludes,
      })) as any;
    } catch (err) {
      console.error("Failed to create new Event.", (err as Error).message);
      return null;
    }
  }
}
