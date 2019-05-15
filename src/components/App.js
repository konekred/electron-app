import React from 'react'
// import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import Header from 'shared/Header'
import Routes from './Routes'

// import gql from 'graphql-tag'

// const graphQLClient = new ApolloClient({
//   uri: '/graphql'
// })

// const App = () => (
//   <ApolloProvider client={graphQLClient}>
//     <Routes>
//       <Header />
//     </Routes>
//   </ApolloProvider>
// )

const App = () => (
  <Routes>
    <Header />
  </Routes>
)

export default App
