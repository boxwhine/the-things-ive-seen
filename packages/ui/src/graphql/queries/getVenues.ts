import { gql } from "@apollo/client";

export type Venue = {
  id: string;
  name: string;
  city: string;
  state: string;
};

export type Response = {
  fetchVenues: Venue[];
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
