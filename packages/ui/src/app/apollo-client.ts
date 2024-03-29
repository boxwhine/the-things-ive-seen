import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000",
  });

export default createApolloClient;
