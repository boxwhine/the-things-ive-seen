import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './components/app';
import registerServiceWorker from './registerServiceWorker';
import './compiled/index.css';

const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://localhost:4000' }),
  cache: new InMemoryCache(),
});

render(
  <BrowserRouter>
    <>
      <CssBaseline />
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </>
  </BrowserRouter>,
  document.getElementById('root'),
);

registerServiceWorker();
