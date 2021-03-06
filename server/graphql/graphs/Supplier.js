const {
  GraphQLInt,
  GraphQLString
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
        search: {
          name: 'search',
          type: GraphQLString
        }
      },
      resolve: (root, args) => {
        return new Promise(async (resolve, reject) => {
          try {
            const params = {}
            const limit = args.limit || null
            const page = args.page || 1
            const search = args.search || null

            const whereClause = search ? 'WHERE `code` LIKE :search OR `name` LIKE :search OR tinNumber LIKE :search' : ''
            const limitClause = limit ? 'LIMIT :limit' : ''
            const offsetClause = limit ? 'OFFSET :offset' : ''

            params.search = `%${search}%`
            params.limit = limit
            params.offset = limit ? (page - 1) * limit: null

            const data = await db.query(`
              SELECT
                id,
                code,
                name,
                tinNumber
              FROM
                suppliers
              ${whereClause}
              ORDER BY
                name ASC
              ${limitClause}
              ${offsetClause}
            `, params)

            const count = await db.queryFirst(`SELECT COUNT(*) AS \`count\` FROM suppliers ${whereClause}`, params)
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
