const { GraphQLObjectType } = require('graphql')

const SupplierGraph = require('./graphs/Supplier')
const DeliveryGraph = require('./graphs/Delivery')

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    suppliers: SupplierGraph.query.suppliers,
    deliveries: DeliveryGraph.query.deliveries
  }
})

module.exports = QueryType
