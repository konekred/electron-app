const { GraphQLObjectType } = require('graphql')

const SupplierGraph = require('./graphs/Supplier')
const DeliveryGraph = require('./graphs/Delivery')
const BadOrderGraph = require('./graphs/BadOrder')

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    suppliers: SupplierGraph.query.suppliers,
    deliveries: DeliveryGraph.query.deliveries,
    badOrders: BadOrderGraph.query.badOrders
  }
})

module.exports = QueryType
