const {
  GraphQLObjectType,
  GraphQLList
} = require('graphql')

const ErrorType = require('./ErrorType')
const PaginationType = require('./PaginationType')

const PaginatedPayload = (name, type) => {
  return new GraphQLObjectType({
    name: name,
    fields: () => ({
      data: {
        type: new GraphQLList(type)
      },
      errors: {
        type: new GraphQLList(ErrorType)
      },
      pagination: {
        type: PaginationType
      }
    })
  })
}

module.exports = PaginatedPayload
