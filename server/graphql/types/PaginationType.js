const {
  GraphQLObjectType,
  GraphQLInt
} = require('graphql')

const PaginationType = new GraphQLObjectType({
  name: 'PaginationType',
  fields: () => ({
    count: {
      type: GraphQLInt
    },
    limit: {
      type: GraphQLInt
    },
    pages: {
      type: GraphQLInt
    },
    page: {
      type: GraphQLInt
    }
  })
})

module.exports = PaginationType
