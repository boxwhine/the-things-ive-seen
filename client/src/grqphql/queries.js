import gql from 'graphql-tag';

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
