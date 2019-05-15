const {
  GraphQLObjectType,
  GraphQLInt
} = require('graphql')

const PaginationType = new GraphQLObjectType({
  name: 'PaginationType',
  fields: () => ({
    pages: {
      type: GraphQLInt
    },
    count: {
      type: GraphQLInt
    },
    limit: {
      type: GraphQLInt
    },
    lastId: {
      type: GraphQLInt
    }
  })
})

module.exports = PaginationType
