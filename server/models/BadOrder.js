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
          referenceNumber,
          supplierId,
          quantity,
          \`amount\`,
          \`date\`
        ) VALUES (
          :transactionNumber,
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
                  formattedRow.ok = true
                  formattedRow.supplierId = supplier.id
                  formattedRow.supplier.exists = true
                } else {
                  formattedRow.supplier.exists = false
                  formattedRow.errors.push({
                    message: 'supplier does not exists'
                  })
                }
              }

              formattedRows.push(formattedRow)
            }
          }
        }


        fs.writeFileSync(path.join(tmpPath, 'import-bad-orders.json'), JSON.stringify({
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
    return new Promise(async (resolve, reject) => {
      const importFilePath = path.join(tmpPath, 'import-bad-orders.json')

      if (fs.existsSync(importFilePath)) {
        const jsonStr = fs.readFileSync(importFilePath)
        if (JSON.parse(jsonStr)) {
          const jsonData = JSON.parse(jsonStr)
          const badOrders = jsonData.badOrders

          let successCount = 0
          const dataCount = badOrders.length
          const errors = []

          for (let i = 0; i < badOrders.length; i++) {
            const badOrder = badOrders[i]
            if (badOrder.ok) {
              await BadOrder.insert(badOrder).then(success => {
                if (success) {
                  successCount += 1
                }
              }).catch(err => {
                errors.push({
                  data: badOrder,
                  error: err
                })
              })
            } else {
              errors.push({
                data: badOrder,
                error: `supplier does not exists ${badOrder.supplier.code} - ${badOrder.supplier.name}`
              })
            }
          }

          fs.unlinkSync(importFilePath)

          resolve({
            ok: true,
            successCount,
            dataCount,
            errors
          })

        }
      } else {
        reject({ message: 'import-bad-orders.json does not exists' })
      }
    })
  }
}

module.exports = BadOrder
