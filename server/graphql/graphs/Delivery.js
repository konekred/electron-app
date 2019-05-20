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

            const whereClause = search ? 'WHERE `deliveries`.`invoiceNumber` LIKE :search OR `suppliers`.`name` LIKE :search' : ''
            const limitClause = limit ? 'LIMIT :limit' : ''
            const offsetClause = limit ? 'OFFSET :offset' : ''

            params.search = `%${search}%`
            params.limit = limit
            params.offset = limit ? (page - 1) * limit : null

            const deliveriesData = await db.query(`
              SELECT
                deliveries.id,
                deliveries.invoiceNumber,
                deliveries.supplierId,
                deliveries.amount,
                deliveries.\`date\`,
                suppliers.\`name\`
              FROM
                deliveries
                INNER JOIN suppliers ON suppliers.id = deliveries.supplierId
              ${whereClause}
              ORDER BY
                deliveries.\`date\` DESC,
                suppliers.\`name\` ASC,
                deliveries.\`invoiceNumber\`
              ${limitClause}
              ${offsetClause}
            `, params)

            const data = deliveriesData.map(({ id, invoiceNumber, amount, date, supplierId, name }) => {
              return {
                id,
                invoiceNumber,
                amount,
                date,
                supplier: {
                  id: supplierId,
                  name
                }
              }
            })

            const count = await db.queryFirst(`SELECT COUNT(*) AS \`count\` FROM deliveries INNER JOIN suppliers ON suppliers.id = deliveries.supplierId ${whereClause}`, params)
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
