const {
  GraphQLInt,
  GraphQLString
} = require('graphql')

const { BadOrderType } = require('../types/BadOrder')
const PaginatedPayload = require('../types/PaginatedPayload')
const db = require('../../database')

const BadOrderGraph = {
  query: {
    badOrders: {
      type: PaginatedPayload('BadOrdersPayload', BadOrderType),
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

            const whereClause = search ? 'WHERE `suppliers`.`code` LIKE :search  OR `suppliers`.`name` LIKE :search OR bad_orders.transactionNumber LIKE :search' : ''
            const limitClause = limit ? 'LIMIT :limit' : ''
            const offsetClause = limit ? 'OFFSET :offset' : ''

            params.search = `%${search}%`
            params.limit = limit
            params.offset = limit ? (page - 1) * limit : null

            const badOrdersData = await db.query(`
              SELECT
                bad_orders.id,
                bad_orders.transactionNumber,
                bad_orders.referenceNumber,
                bad_orders.quantity,
                bad_orders.amount,
                DATE_FORMAT(bad_orders.date, "%Y-%m-%d") AS \`date\`,
                bad_orders.supplierId,
                suppliers.code,
                suppliers.name
              FROM
                bad_orders
                INNER JOIN suppliers ON suppliers.id = bad_orders.supplierId
              ${whereClause}
              ORDER BY
                bad_orders.date DESC
              ${limitClause}
              ${offsetClause}
            `, params)

            // formatting for graphql
            const data = badOrdersData.map(({
              id,
              transactionNumber,
              referenceNumber,
              quantity,
              amount,
              date,
              supplierId,
              code,
              name
            }) => {
              return {
                id,
                transactionNumber,
                referenceNumber,
                quantity,
                amount,
                date,
                supplier: {
                  id: supplierId,
                  code: code,
                  name: name
                }
              }
            })

            const count = await db.queryFirst(`
              SELECT
                COUNT(*) AS count
              FROM
                (
                  SELECT
                    bad_orders.id
                  FROM
                    bad_orders
                    INNER JOIN suppliers ON suppliers.id = bad_orders.supplierId
                  ${whereClause}
                ) AS badOrders
            `, params)

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

module.exports = BadOrderGraph
