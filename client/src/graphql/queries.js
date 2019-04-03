import gql from 'graphql-tag';

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      date
      venue {
        name
        city
        state
      }
      genre
      subGenre
    }
  }
`;

export const GET_VENUES = gql`
  query GetVenues {
    venues {
      id
      name
      city
      state
    }
  }
`;
