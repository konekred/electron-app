const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql')

const ErrorType = new GraphQLObjectType({
  name: 'ErrorType',
  fields: () => ({
    message: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    path: {
      type: GraphQLString
    },
    value: {
      type: GraphQLString
    }
  })
})


module.exports = ErrorType
