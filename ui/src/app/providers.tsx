"use client";

import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {isDev} from '../utils';

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: isDev(),
  uri: "http://localhost:4000",
});

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;

export default RootLayout;