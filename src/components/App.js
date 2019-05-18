import React from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import Header from '@shared/Header'
import Routes from './Routes'

const graphQLClient = new ApolloClient({
  uri: '/graphql'
})

const App = () => (
  <ApolloProvider client={graphQLClient}>
    <Routes>
      <Header />
    </Routes>
  </ApolloProvider>
)


export default App
