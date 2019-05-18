const {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
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
    },
    taxClass: {
      type: GraphQLString
    },
    principal: {
      type: GraphQLString
    },
    terms: {
      type: GraphQLString
    },
    address: {
      type: GraphQLString
    },
    contactNumber: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    representative: {
      type: GraphQLString
    },
    representativeContact: {
      type: GraphQLString
    },
    active: {
      type: GraphQLBoolean
    }
  })
})

module.exports = {
  SupplierType
}
