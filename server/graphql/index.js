const { GraphQLSchema } = require('graphql')

const QueryType = require('./QueryType')
// const MutationType = require('./MutationType')

const graphQLSchema = new GraphQLSchema({
  query: QueryType
  // mutation: MutationType
})

module.exports = graphQLSchema
