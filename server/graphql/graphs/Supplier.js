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
        page: {
          name: 'page',
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
            const limit = args.limit || null
            const page = args.page || 1

            const topClause = limit ? `TOP ${limit} ` : ''
            let whereClause = ''

            if (page > 1 && limit) {
              whereClause = `${whereClause}[id] NOT IN (SELECT TOP ${(page - 1) * limit} [id] FROM [Suppliers] ORDER BY [Suppliers].[name] ASC)`
            }

            if (whereClause) {
              whereClause = ` WHERE ${whereClause}`
            }

            const data = await db.query(`
              SELECT
                ${topClause}
                [id],
                [code],
                [name],
                [TIN]
              FROM
                [Suppliers]
              ${whereClause}
              ORDER BY
                [Suppliers].[name] ASC
            `, null)

            const count = await db.query('SELECT COUNT(*) AS [count] FROM Suppliers', null, { first: true })
            const pages = limit ? Math.ceil(count.count / limit) : 1
            const pagination = {
              count: count.count,
              limit,
              pages,
              page
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
