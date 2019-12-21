import gql from 'graphql-tag';

// mutation saveRocket($rocket: RocketInput!) {
//   saveRocket(rocket: $rocket) {
//     model
//   }

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
    addVenue(venue: {
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
