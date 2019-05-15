const { GraphQLObjectType } = require('graphql')

const SupplierGraph = require('./graphs/Supplier')

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    suppliers: SupplierGraph.query.suppliers
  }
})

module.exports = QueryType
