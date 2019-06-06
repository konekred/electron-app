const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType
} = require('graphql')

const { SupplierType } = require('./Supplier')

const BadOrderType = new GraphQLObjectType({
  name: 'BadOrderType',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    transactionNumber: {
      type: GraphQLID
    },
    referenceNumber: {
      type: GraphQLInt
    },
    quantity: {
      type: GraphQLFloat
    },
    amount: {
      type: GraphQLFloat
    },
    date: {
      type: GraphQLString
    },
    remark: {
      type: GraphQLString
    },
    supplier: {
      type: SupplierType
    }
  })
})

module.exports = {
  BadOrderType
}
