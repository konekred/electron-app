const {
  GraphQLInt,
  GraphQLString
} = require('graphql')

const { DeliveryType } = require('../types/Delivery')
const PaginatedPayload = require('../types/PaginatedPayload')
const db = require('../../database')

const DeliveryGraph = {
  query: {
    deliveries: {
      type: PaginatedPayload('DeliveriesPayload', DeliveryType),
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

            const whereClause = search ? 'WHERE `suppliers`.`name` LIKE :search OR deliveries.purchaseOrderNumber LIKE :search' : ''
            const limitClause = limit ? 'LIMIT :limit' : ''
            const offsetClause = limit ? 'OFFSET :offset' : ''

            params.search = `%${search}%`
            params.limit = limit
            params.offset = limit ? (page - 1) * limit : null

            const deliveriesData = await db.query(`
              SELECT
                deliveries.purchaseOrderNumber,
                deliveries.supplierId,
                suppliers.code,
                suppliers.name,
                SUM(deliveries.quantity) AS quantity,
                SUM(deliveries.amount) AS amount,
                DATE_FORMAT(deliveries.date, "%Y-%m-%d %H:%i:%s") AS \`date\`,
                COUNT(*) AS transactionCount
              FROM
                deliveries
                INNER JOIN suppliers ON suppliers.id = deliveries.supplierId
              ${whereClause}
              GROUP BY
                purchaseOrderNumber
              ORDER BY
                deliveries.date DESC
              ${limitClause}
              ${offsetClause}
            `, params)

            // formatting for graphql
            const data = deliveriesData.map(({
              purchaseOrderNumber,
              supplierId,
              code,
              name,
              quantity,
              amount,
              date,
              transactionCount
            }) => {
              return {
                purchaseOrderNumber,
                quantity,
                amount,
                date,
                supplier: {
                  id: supplierId,
                  code,
                  name
                },
                transactionCount
              }
            })

            const count = await db.queryFirst(`
              SELECT
                COUNT(*) AS count
              FROM
                (
                  SELECT
                    purchaseOrderNumber
                  FROM
                    deliveries
                    INNER JOIN suppliers ON suppliers.id = deliveries.supplierId
                    ${whereClause}
                  GROUP BY
                    purchaseOrderNumber
                ) AS purchaseOrders
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

module.exports = DeliveryGraph
