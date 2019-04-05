import gql from 'graphql-tag';

export const ADD_EVENT = gql`
  mutation NewEvent(
    $date: Date!,
    $name: String!,
    $genre: String!,
    $subGenre: String,
    $faceValue: Float,
    $venue: ID
  ) {
    createEvent(input:{
      name: $name,
      date: $date,
      genre: $genre,
      subGenre: $subGenre,
      faceValue: $faceValue,
      venue: $venue,
    }) {
      name,
      id,
      date,
      venue {
        name
        city
        state
      }
    }
  }
`;

export const ADD_VENUE = gql`
  mutation NewVenue(
    $address: String!,
    $city: String!,
    $lat: Float!,
    $lng: Float!,
    $name: String!,
    $placeId: String!,
    $state: String!
  ) {
    createVenue(input: {
      address: $address,
      city: $city,
      lat: $lat,
      lng: $lng,
      name: $name,
      placeId: $placeId,
      state: $state,
    }) {
      id,
      address,
      city,
      lat,
      lng,
      name,
      placeId,
      state,
    }
  }
`;
