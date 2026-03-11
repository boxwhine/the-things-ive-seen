import { prisma } from "../db/prisma";
import builder from "./builder";

const eventIncludes = { venue: true, genre: true, subGenre: true };

builder.prismaObject("Event", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    date: t.expose("date", { type: "DateTime" }),
    faceValue: t.exposeInt("faceValue", { nullable: true }),
    festivalName: t.exposeString("festivalName", { nullable: true }),
    wasOpener: t.exposeBoolean("wasOpener", { nullable: true }),
    venueId: t.exposeInt("venueId"),
    genreId: t.exposeInt("genreId"),
    subGenreId: t.exposeInt("subGenreId", { nullable: true }),
    venue: t.relation("venue"),
    genre: t.relation("genre"),
    subGenre: t.relation("subGenre", { nullable: true }),
  }),
});

const AddEventInput = builder.inputType("AddEventInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    date: t.field({ type: "DateTime", required: true }),
    venueId: t.int({ required: true }),
    genreId: t.int({ required: true }),
    faceValue: t.int(),
    festivalName: t.string(),
    wasOpener: t.boolean(),
    subGenreId: t.int(),
  }),
});

builder.queryField("fetchEvents", (t) =>
  t.prismaField({
    type: ["Event"],
    resolve: (query) =>
      prisma.event.findMany({ ...query, include: eventIncludes }),
  }),
);

builder.mutationField("addEvent", (t) =>
  t.prismaField({
    type: "Event",
    nullable: true,
    args: {
      event: t.arg({ type: AddEventInput, required: true }),
    },
    resolve: async (query, _parent, args) => {
      try {
        return await prisma.event.create({
          ...query,
          data: {
            name: args.event.name,
            date: args.event.date,
            venueId: args.event.venueId,
            genreId: args.event.genreId,
            faceValue: args.event.faceValue,
            festivalName: args.event.festivalName,
            wasOpener: args.event.wasOpener,
            subGenreId: args.event.subGenreId,
          },
          include: eventIncludes,
        });
      } catch (err) {
        console.error("Failed to create new Event.", (err as Error).message);
        return null;
      }
    },
  }),
);
