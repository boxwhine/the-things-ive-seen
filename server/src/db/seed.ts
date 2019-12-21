import { Event, Genre, Venue } from '../models';

export default async () => {
  const [
    vFunhouse,
    vCasaDiablo,
    vHouseRising,
    vSuperdome,
  ]: Venue[] = await Venue.bulkCreate(
    [
      {
        address: '109 Eastlake Ave E, Seattle, WA 98109, USA',
        city: 'Seattle',
        lat: 47.61863259999999,
        lng: -122.32938109999998,
        name: 'Funhouse',
        placeId: 'ChIJb4ahcjQVkFQRjOxLsPrdi-c',
        state: 'WA',
      },
      {
        address: '2839 NW St Helens Rd, Portland, OR 97210, USA',
        city: 'Portland',
        lat: 45.5428816,
        lng: -122.72132650000003,
        name: 'Casa Diablo',
        placeId: 'ChIJmeXe0cUJlVQR4stEud7DI0c',
        state: 'OR',
      },
      {
        address: '120 W 5th St, Austin, TX 78701, USA',
        city: 'Austin',
        lat: 30.2675011,
        lng: -97.74400209999999,
        name: 'House of the Rising Tanuki - San',
        placeId: 'ChIJ6-RvIgm1RIYRIk94UH9u-aE',
        state: 'TX',
      },
      {
        address: '1500 Sugar Bowl Dr, New Orleans, LA 70112, USA',
        city: 'New Orleans',
        lat: 29.951061,
        lng: -90.08124420000001,
        name: 'Mercedes-Benz Superdome',
        placeId: 'ChIJEUghgt2lIIYRr-NZFkpLNW4',
        state: 'LA',
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
      faceValue: 15.00,
      // festivalName: null,
      genreId: gMusic.id,
      name: 'Benny & The Jets',
      subGenreId: sgRock.id,
      venueId: vFunhouse.id,
      wasOpener: true,
    },
    {
      date: new Date('2012-03-01T19:21:20.743Z'),
      faceValue: 32.50,
      genreId: gMusic.id,
      name: 'Deadmau5',
      subGenreId: sgEdm.id,
      venueId: vHouseRising.id,
      wasOpener: false,
    },
    {
      date: '1999-12-25T22:10:13.743Z',
      faceValue: 17,
      genreId: gMusic.id,
      name: 'Burl Ives Sings Xmas Classics',
      subGenreId: sgHoliday.id,
      venueId: vCasaDiablo.id,
      wasOpener: false,
    },
    {
      date: '1984-02-17T20:30:00.743Z',
      faceValue: 19.75,
      genreId: gSports.id,
      name: 'Monster Jam XII',
      subGenreId: sgMotorAuto.id,
      venueId: vHouseRising.id,
      wasOpener: null,
    },
    {
      date: '2018-09-12T10:00:00.743Z',
      faceValue: 12.00,
      genreId: gSports.id,
      name: 'Positive Vibrations: Morning Yoga Jam Box Session',
      subGenreId: sgYoga.id,
      venueId: vCasaDiablo.id,
      wasOpener: null,
    },
  ]);
};
