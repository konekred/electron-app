const root = '../..'
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const numeral = require('numeral')
const db = require('../database')
const CsvReader = require(`${root}/lib/CsvReader`)
const fieldsExists = require(`${root}/lib/helpers/fieldsExists`)
const tmpPath = path.resolve('tmp')
const Supplier = require('./Supplier')
// const logger = require(`${root}/logger/app`)

class BadOrder {
  static findByTransactionNumber(transactionNumber) {
    return new Promise((resolve, reject) => {
      db.queryFirst('SELECT `id`, `transactionNumber` FROM `bad_orders` WHERE `transactionNumber` = :transactionNumber LIMIT 1', { transactionNumber }).then(badOrder => {
        resolve(badOrder)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static insert(data) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO bad_orders (
          transactionNumber,
          purchaseOrderNumber,
          referenceNumber,
          supplierId,
          quantity,
          \`amount\`,
          \`date\`
        ) VALUES (
          :transactionNumber,
          :purchaseOrderNumber,
          :referenceNumber,
          :supplierId,
          :quantity,
          :amount,
          :date
        )
      `

      db.exec(sql, data, 'INSERT').then(data => {
        resolve({
          id: data[0],
          count: data[1]
        })
      }).catch(err => {
        reject(err)
      })
    })
  }


  static csvReader(filepath, validate = false) {
    return new Promise((resolve, reject) => {
      const csvReader = new CsvReader(filepath)

      csvReader.read().then(async (rows) => {
        const errors = []
        const formattedRows = []

        if (validate) {
          let isValidCsvFormat = false

          if (rows.length > 0) {
            isValidCsvFormat = fieldsExists(['trans', 'date', 'refno', 'time', 'supplier', 'suppcode'], rows[0])
          }

          if (isValidCsvFormat) {
            for (let i = 0; i < rows.length; i++) {
              const row = rows[i]
              const formattedRow = {
                ok: false,
                transactionNumber: numeral(row.trans).value(),
                referenceNumber: numeral(row.refno).value(),
                quantity: numeral(row.qty).value(),
                amount: numeral(row.amount).value(),
                date: moment(`${row.date}`, 'D-MMM-YY').format('YYYY-MM-DD'),
                remark: row.remark,
                supplier: {
                  code: parseInt(row.suppcode),
                  name: row.supplier.trim()
                },
                errors: []
              }

              if (formattedRow.supplier && formattedRow.transactionNumber) {
                await BadOrder.findByTransactionNumber(formattedRow.transactionNumber).then(badOrder => {
                  if (badOrder) {
                    formattedRow.ok = false
                  }
                }).catch(err => {
                  errors.push(err)
                })

                const supplier = await Supplier.findByCode(formattedRow.supplier.code).catch(err => {
                  errors.push(err)
                })


                if (supplier) {
                  // get purchaseOrderNumber
                  const delivery = await db.queryFirst('SELECT purchaseOrderNumber FROM deliveries WHERE supplierId = :supplierId AND DATE_FORMAT(`date`, \'%Y-%m-%d\') = :date LIMIT 1', {
                    supplierId: supplier.id,
                    date: formattedRow.date
                  }).catch(err => {
                    errors.push(err)
                  })

                  if (delivery) {
                    formattedRow.ok = true
                    formattedRow.purchaseOrderNumber = delivery.purchaseOrderNumber
                    formattedRow.supplierId = supplier.id
                  } else {
                    formattedRow.errors.push({
                      message: 'delivery does not exists'
                    })
                  }

                  formattedRow.supplier.exists = true
                } else {
                  formattedRow.errors.push({
                    message: 'supplier does not exists'
                  })
                }
              }

              formattedRows.push(formattedRow)
            }
          }
        }


        fs.writeFileSync(path.join(tmpPath, 'import-bad-order.json'), JSON.stringify({
          badOrders: formattedRows,
          errors: errors.length == 0 ? null : errors
        }, null, 2))

        resolve({
          rows: formattedRows,
          errors: errors.length == 0 ? null : errors
        })

      }).catch(err => {
        reject(err)
      })
    })
  }


  static saveImport() {
    // return new Promise((resolve, reject) => {

    // })
  }
}

module.exports = BadOrder
