const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType
} = require('graphql')

const { SupplierType } = require('./Supplier')

const DeliveryType = new GraphQLObjectType({
  name: 'DeliveryType',
  fields: () => ({
    purchaseOrderNumber: {
      type: GraphQLID
    },
    supplierId: {
      type: GraphQLID
    },
    quantity: {
      type: GraphQLInt
    },
    amount: {
      type: GraphQLFloat
    },
    date: {
      type: GraphQLString
    },
    transactionCount: {
      type: GraphQLInt
    },
    supplier: {
      type: SupplierType
    }
  })
})

module.exports = {
  DeliveryType
}
