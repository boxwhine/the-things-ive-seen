import { Event, Genre, Venue } from '../models';

export default async () => {
  const [
    vFunhouse,
    vAcropolis,
    vSuperstarArena,
    vHDCenter,
  ]: Venue[] = await Venue.bulkCreate(
    [
      {
        address: '123 Main St',
        city: 'Austin',
        lat: 123456789,
        lng: 987654321,
        name: 'Funhouse',
        state: 'TX',
      },
      {
        address: '55 Lonely St',
        city: 'Portland',
        lat: 553355335,
        lng: 100000012,
        name: 'The Acropolis',
        state: 'OR',
      },
      {
        address: '100 Freedom Ave',
        city: 'New York',
        lat: 105810837,
        lng: 777711120,
        name: 'Super Star Arena NYC',
        state: 'NY',
      },
      {
        address: '1 Constitution Boulevard',
        city: 'Boston',
        lat: 108371058,
        lng: 771112077,
        name: 'Home Depot Center',
        state: 'MA',
      },
    ],
    { returning: true }
  );

  const [gMusic, gComedy, gMovie, gSports]: Genre[] = await Genre.bulkCreate(
    [
      {
        name: 'Music',
      },
      {
        name: 'Comedy',
      },
      {
        name: 'Movie',
      },
      {
        name: 'Sports',
      },
    ],
    { returning: true }
  );

  const [
    sgRock,
    sgEdm,
    sgHoliday,
    sgStandup,
    sgFootball,
    sgMotorAuto,
    sgYoga,
  ]: Genre[] = await Genre.bulkCreate(
    [
      {
        name: 'Rock',
        parentId: gMusic.id,
      },
      {
        name: 'EDM',
        parentId: gMusic.id,
      },
      {
        name: 'Holiday',
        parentId: gMusic.id,
      },
      {
        name: 'Stand-up',
        parentId: gComedy.id,
      },
      {
        name: 'Football',
        parentId: gSports.id,
      },
      {
        name: 'Yoga',
        parentId: gSports.id,
      },
      {
        name: 'Motor/Auto',
        parentId: gSports.id,
      },
    ],
    { returning: true }
  );

  await Event.bulkCreate([
    {
      date: '2019-07-25T16:04:25.743Z',
      faceValue: 15,
      // festivalName: null,
      genreId: gMusic.id,
      name: 'Benny & The Jets',
      subGenreId: sgRock.id,
      venueId: vFunhouse.id,
      wasOpener: true,
    },
    {
      date: new Date('2012-03-01T19:21:20.743Z'),
      faceValue: 32,
      genreId: gMusic.id,
      name: 'Deadmau5',
      subGenreId: sgEdm.id,
      venueId: vSuperstarArena.id,
      wasOpener: false,
    },
    {
      date: '1999-12-25T22:10:13.743Z',
      faceValue: 17,
      genreId: gMusic.id,
      name: 'Burl Ives Sings Xmas Classics',
      subGenreId: sgHoliday.id,
      venueId: vAcropolis.id,
      wasOpener: false,
    },
    {
      date: '1984-02-17T20:30:00.743Z',
      faceValue: 17,
      genreId: gSports.id,
      name: 'Monster Jam XII',
      subGenreId: sgMotorAuto.id,
      venueId: vSuperstarArena.id,
      wasOpener: null,
    },
    {
      date: '2018-09-12T10:00:00.743Z',
      faceValue: 12,
      genreId: gSports.id,
      name: 'Positive Vibrations: Morning Yoga Jam Box Session',
      subGenreId: sgYoga.id,
      venueId: vAcropolis.id,
      wasOpener: null,
    },
  ]);
};
