import gql from 'graphql-tag';

export default gql`
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
