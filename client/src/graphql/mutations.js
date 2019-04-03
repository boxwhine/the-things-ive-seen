import gql from 'graphql-tag';

export const ADD_EVENT = gql`
  mutation NewEvent($date: Date!, $name: String!, $genre: String!, $subGenre: String, $faceValue: Float, $venue: ID) {
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
  mutation NewVenue($city: String!, $name: String!, $state: String!) {
    createVenue(input: {
      city: $city,
      name: $name,
      state: $state,
    }) {
      id,
      city,
      name,
      state,
    }
  }
`;
