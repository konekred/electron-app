const {
  GraphQLObjectType,
  GraphQLList
} = require('graphql')

const ErrorType = require('./ErrorType')

const MutationPayload = (name, type) => {
  return new GraphQLObjectType({
    name: name,
    fields: () => ({
      data: {
        type: type
      },
      errors: {
        type: new GraphQLList(ErrorType)
      }
    })
  })
}

module.exports = MutationPayload
