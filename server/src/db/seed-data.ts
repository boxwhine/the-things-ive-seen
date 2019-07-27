export const eventData: any[] = [{
  date: '2019-07-25T16:04:25.743Z',
  faceValue: 15,
  festivalName: null,
  name: 'Benny & The Jets',
  wasOpener: true,
}, {
  date: '2012-03-01T19:21:20.743Z',
  faceValue: 32,
  festivalName: 'Electric Rainbow Festival',
  name: 'Deadmau5',
  wasOpener: false,
}, {
  date: '1999-12-25T22:10:13.743Z',
  faceValue: 17,
  festivalName: null,
  name: 'Burl Ives Sings Xmas Classics',
}, {
  date: '1984-02-17T20:30:00.743Z',
  faceValue: 17,
  festivalName: null,
  name: 'Monster Jam XII',
}, {
  date: '2018-09-12T10:00:00.743Z',
  faceValue: 12,
  festivalName: null,
  name: 'Positive Vibrations: Morning Yoga Jam Box Session',
}];

export const venueData: any[] = [{
  address: '123 Main St',
  city: 'Austin',
  lat: 123456789,
  lng: 987654321,
  name: 'Funhouse',
  // placeId: '',
  state: 'TX',
}, {
  address: '55 Lonely St',
  city: 'Portland',
  lat: 553355335,
  lng: 100000012,
  name: 'The Acropolis',
  // placeId: '',
  state: 'OR',
}, {
  address: '100 Freedom Ave',
  city: 'New York',
  lat: 105810837,
  lng: 777711120,
  name: 'Super Star Arena NYC',
  // placeId: '',
  state: 'NY',
}, {
  address: '1 Constitution Boulevard',
  city: 'Boston',
  lat: 108371058,
  lng: 771112077,
  name: 'Home Depot Center',
  // placeId: '',
  state: 'MA',
}];

export const genreData: any[] = [{
  name: 'Music',
}, {
  name: 'Comedy',
}, {
  name: 'Movie',
}, {
  name: 'Sports',
}];

export const subGenreData: any[] = [{
  name: 'Rock',
  parentId: 1,
}, {
  name: 'Hip-Hop',
  parentId: 1,
}, {
  name: 'Stand-up',
  parentId: 2,
}, {
  name: 'Football',
  parentId: 4,
}, {
  name: 'Wrestling',
  parentId: 4,
}];
