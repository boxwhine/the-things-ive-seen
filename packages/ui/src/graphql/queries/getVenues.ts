import { gql } from "@apollo/client";

export interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface Response {
  fetchVenues: Venue[];
}

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
