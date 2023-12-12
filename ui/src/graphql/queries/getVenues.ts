import gql from 'graphql-tag';

export type Venue = {
  id: string;
  name: string;
  city: string;
  state: string;
};

export type Response = {
  venues: Venue[];
};

export default gql`
  query GetVenues {
    fetchVenues {
      id
      name
      city
      state
    }
  }
`;
