import { prisma } from "./prisma";

export default async () => {
  // Venues
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        address: "123 Main St",
        city: "Austin",
        lat: 123456789,
        lng: 987654321,
        name: "Funhouse",
        state: "TX",
      },
    }),
    prisma.venue.create({
      data: {
        address: "55 Lonely St",
        city: "Portland",
        lat: 553355335,
        lng: 100000012,
        name: "The Acropolis",
        state: "OR",
      },
    }),
    prisma.venue.create({
      data: {
        address: "100 Freedom Ave",
        city: "New York",
        lat: 105810837,
        lng: 777711120,
        name: "Super Star Arena NYC",
        state: "NY",
      },
    }),
    prisma.venue.create({
      data: {
        address: "1 Constitution Boulevard",
        city: "Boston",
        lat: 108371058,
        lng: 771112077,
        name: "Home Depot Center",
        state: "MA",
      },
    }),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vFunhouse, vAcropolis, vSuperstarArena, vHDCenter] = venues;

  // Root genres
  const rootGenres = await Promise.all([
    prisma.genre.create({ data: { name: "Music" } }),
    prisma.genre.create({ data: { name: "Comedy" } }),
    prisma.genre.create({ data: { name: "Movie" } }),
    prisma.genre.create({ data: { name: "Sports" } }),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gMusic, gComedy, gMovie, gSports] = rootGenres;

  // Sub-genres
  const subGenres = await Promise.all([
    prisma.genre.create({ data: { name: "Rock", parentId: gMusic.id } }),
    prisma.genre.create({ data: { name: "EDM", parentId: gMusic.id } }),
    prisma.genre.create({ data: { name: "Holiday", parentId: gMusic.id } }),
    prisma.genre.create({ data: { name: "Stand-up", parentId: gComedy.id } }),
    prisma.genre.create({ data: { name: "Football", parentId: gSports.id } }),
    prisma.genre.create({ data: { name: "Yoga", parentId: gSports.id } }),
    prisma.genre.create({ data: { name: "Motor/Auto", parentId: gSports.id } }),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sgRock, sgEdm, sgHoliday, sgStandup, sgFootball, sgYoga, sgMotorAuto] =
    subGenres;

  // Events
  await Promise.all([
    prisma.event.create({
      data: {
        date: new Date("2019-07-25T16:04:25.743Z"),
        faceValue: 15,
        genreId: gMusic.id,
        name: "Benny & The Jets",
        subGenreId: sgRock.id,
        venueId: vFunhouse.id,
        wasOpener: true,
      },
    }),
    prisma.event.create({
      data: {
        date: new Date("2012-03-01T19:21:20.743Z"),
        faceValue: 32,
        genreId: gMusic.id,
        name: "Deadmau5",
        subGenreId: sgEdm.id,
        venueId: vSuperstarArena.id,
        wasOpener: false,
      },
    }),
    prisma.event.create({
      data: {
        date: new Date("1999-12-25T22:10:13.743Z"),
        faceValue: 17,
        genreId: gMusic.id,
        name: "Burl Ives Sings Xmas Classics",
        subGenreId: sgHoliday.id,
        venueId: vAcropolis.id,
        wasOpener: false,
      },
    }),
    prisma.event.create({
      data: {
        date: new Date("1984-02-17T20:30:00.743Z"),
        faceValue: 17,
        genreId: gSports.id,
        name: "Monster Jam XII",
        subGenreId: sgMotorAuto.id,
        venueId: vSuperstarArena.id,
      },
    }),
    prisma.event.create({
      data: {
        date: new Date("2018-09-12T10:00:00.743Z"),
        faceValue: 12,
        genreId: gSports.id,
        name: "Positive Vibrations: Morning Yoga Jam Box Session",
        subGenreId: sgYoga.id,
        venueId: vAcropolis.id,
      },
    }),
  ]);
};
