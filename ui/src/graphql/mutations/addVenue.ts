import {gql} from '@apollo/client';

export default gql`
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
