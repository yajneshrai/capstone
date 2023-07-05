import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';

import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import store from './store';

const httpLink = createHttpLink({
  uri: 'http://localhost:9000/graphql'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({ })
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ChakraProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </ApolloProvider>
);
