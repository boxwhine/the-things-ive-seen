import gql from 'graphql-tag';

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
