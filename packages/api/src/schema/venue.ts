import { prisma } from "../db/prisma.js";
import builder from "./builder.js";

builder.prismaObject("Venue", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    address: t.exposeString("address"),
    city: t.exposeString("city"),
    state: t.exposeString("state"),
    lat: t.exposeFloat("lat", { nullable: true }),
    lng: t.exposeFloat("lng", { nullable: true }),
    placeId: t.exposeString("placeId", { nullable: true }),
    events: t.relation("events", { nullable: true }),
  }),
});

const AddVenueInput = builder.inputType("AddVenueInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    address: t.string({ required: true }),
    city: t.string({ required: true }),
    state: t.string({ required: true }),
    lat: t.float(),
    lng: t.float(),
    placeId: t.string(),
  }),
});

builder.queryField("fetchVenues", (t) =>
  t.prismaField({
    type: ["Venue"],
    resolve: (query) => prisma.venue.findMany({ ...query, include: { events: true } }),
  }),
);

builder.queryField("searchVenuesByName", (t) =>
  t.prismaField({
    type: ["Venue"],
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: (query, _parent, args) =>
      prisma.venue.findMany({
        ...query,
        where: { name: { contains: args.name, mode: "insensitive" } },
        include: { events: true },
      }),
  }),
);

builder.mutationField("addVenue", (t) =>
  t.prismaField({
    type: "Venue",
    nullable: true,
    args: {
      venue: t.arg({ type: AddVenueInput, required: true }),
    },
    resolve: async (query, _parent, args) => {
      const existingVenue = await prisma.venue.findFirst({
        where: {
          name: args.venue.name,
          city: args.venue.city,
          state: args.venue.state,
        },
      });
      if (existingVenue) {
        throw new Error(
          `Venue '${args.venue.name}' in ${args.venue.city}, ${args.venue.state}, already exists.`,
        );
      }

      try {
        return await prisma.venue.create({
          ...query,
          data: {
            name: args.venue.name,
            address: args.venue.address,
            city: args.venue.city,
            state: args.venue.state,
            lat: args.venue.lat,
            lng: args.venue.lng,
            placeId: args.venue.placeId,
          },
        });
      } catch (err) {
        console.error(
          "Failed to create new Venue.",
          err instanceof Error ? err.message : String(err),
        );
        return null;
      }
    },
  }),
);
