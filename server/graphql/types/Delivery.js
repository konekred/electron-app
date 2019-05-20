const {
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLObjectType
} = require('graphql')

const { SupplierType } = require('./Supplier')

const DeliveryType = new GraphQLObjectType({
  name: 'DeliveryType',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    invoiceNumber: {
      type: GraphQLString
    },
    supplierId: {
      type: GraphQLID
    },
    amount: {
      type: GraphQLFloat
    },
    date: {
      type: GraphQLString
    },
    supplier: {
      type: SupplierType
    }
  })
})

module.exports = {
  DeliveryType
}
