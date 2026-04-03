import { prisma } from "../db/prisma.js";
import builder from "./builder.js";

builder.prismaObject("Genre", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name"),
    parentId: t.exposeInt("parentId", { nullable: true }),
    subGenres: t.relation("subGenres", { nullable: true }),
  }),
});

const AddGenreInput = builder.inputType("AddGenreInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    parentId: t.int(),
  }),
});

builder.queryField("fetchGenres", (t) =>
  t.prismaField({
    type: ["Genre"],
    resolve: (query) =>
      prisma.genre.findMany({ ...query, where: { parentId: null } }),
  }),
);

builder.queryField("fetchSubGenres", (t) =>
  t.prismaField({
    type: ["Genre"],
    resolve: (query) =>
      prisma.genre.findMany({ ...query, where: { parentId: { not: null } } }),
  }),
);

builder.queryField("searchGenresByName", (t) =>
  t.prismaField({
    type: ["Genre"],
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: (query, _parent, args) =>
      prisma.genre.findMany({
        ...query,
        where: { name: { contains: args.name, mode: "insensitive" } },
      }),
  }),
);

builder.mutationField("addGenre", (t) =>
  t.prismaField({
    type: "Genre",
    nullable: true,
    args: {
      genre: t.arg({ type: AddGenreInput, required: true }),
    },
    resolve: async (query, _parent, args) => {
      const existingGenre = await prisma.genre.findFirst({
        where: { name: args.genre.name },
      });
      if (existingGenre) {
        throw new Error(`Genre '${args.genre.name}' already exists.`);
      }

      if (
        args.genre.parentId &&
        (await prisma.genre.findUnique({
          where: { id: args.genre.parentId },
        })) === null
      ) {
        throw new Error(
          `No parent genre exists with ID ${args.genre.parentId.toString()}.`,
        );
      }

      try {
        return await prisma.genre.create({
          ...query,
          data: {
            name: args.genre.name,
            parentId: args.genre.parentId,
          },
        });
      } catch (err) {
        console.error("Failed to create new Genre.", (err as Error).message);
        return null;
      }
    },
  }),
);
