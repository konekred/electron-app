const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType
} = require('graphql')

const SupplierType = new GraphQLObjectType({
  name: 'SupplierType',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    code: {
      type: GraphQLString
    },
    TIN: {
      type: GraphQLString
    }
  })
})

module.exports = {
  SupplierType
}
