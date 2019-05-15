const {
  GraphQLInt
} = require('graphql')

const { SupplierType } = require('../types/Supplier')
const PaginatedPayload = require('../types/PaginatedPayload')
const db = require('../../database')

const SupplierGraph = {
  query: {
    suppliers: {
      type: PaginatedPayload('SuppliersPayload', SupplierType),
      args: {
        limit: {
          name: 'limit',
          type: GraphQLInt
        },
        lastId: {
          name: 'lastId',
          type: GraphQLInt
        }
      },
      resolve: (root, args) => {
        return new Promise(async (resolve, reject) => {
          try {
            const params = []
            const limit = args.limit || null
            const lastId = args.lastId || null

            const topClause = limit ? `TOP ${limit} ` : ''
            let whereClause = ''

            if (lastId) {
              whereClause = `${whereClause}[id] > ?`
              params.push(lastId)
            }

            if (params.length) {
              whereClause = ` WHERE ${whereClause}`
            }

            const data = await db.query(`SELECT ${topClause}[id], [name], [code], [TIN] FROM Suppliers${whereClause}`, params)

            const count = await db.query('SELECT COUNT(*) AS [count] FROM Suppliers', null, { first: true })
            const pages = limit ? Math.ceil(count.count / limit) : 1
            const pagination = {
              count: count.count,
              pages: pages,
              limit: limit,
              lastId: data.length ? data[data.length - 1].id : null
            }

            resolve({
              data,
              pagination
            })

          } catch (err) {
            reject(err)
          }
        })
      }
    }
  }
}

module.exports = SupplierGraph
