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
const logger = require(`${root}/logger/app`)

class Delivery {
  static findByTransactionNumber(transactionNumber) {
    return new Promise((resolve, reject) => {
      db.queryFirst('SELECT `id`, `transactionNumber` FROM `deliveries` WHERE `transactionNumber` = :transactionNumber LIMIT 1', { transactionNumber }).then(delivery => {
        resolve(delivery)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static insert(data) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO deliveries (
          transactionNumber,
          purchaseOrderNumber,
          referenceNumber,
          supplierId,
          \`amount\`,
          \`date\`
        ) VALUES (
          :transactionNumber,
          :purchaseOrderNumber,
          :referenceNumber,
          :supplierId,
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
        logger.debug(err)
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
            isValidCsvFormat = fieldsExists(['trans', 'pono', 'refno', 'qty', 'amount', 'date', 'time', 'supplier', 'suppcode'], rows[0])
          }

          if (isValidCsvFormat) {
            for (let i = 0; i < rows.length; i++) {
              const row = rows[i]
              const formattedRow = {
                ok: true,
                transactionNumber: numeral(row.trans).value(),
                purchaseOrderNumber: numeral(row.pono).value(),
                referenceNumber: numeral(row.refno).value(),
                quantity: numeral(row.qty).value(),
                amount: numeral(row.amount).value(),
                date: moment(`${row.date} ${row.time}`, 'D-MMM-YY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
                supplier: {
                  code: parseInt(row.suppcode),
                  name: row.supplier.trim()
                }
              }

              if (formattedRow.supplier && formattedRow.transactionNumber) {
                await Delivery.findByTransactionNumber(formattedRow.transactionNumber).then(delivery => {
                  if (delivery) {
                    formattedRow.ok = false
                  }
                }).catch(err => {
                  errors.push(err)
                })

                const supplier = await Supplier.findByName(formattedRow.supplier.code).catch(err => {
                  errors.push(err)
                })

                if (supplier) {
                  formattedRow.supplier.isNew = false
                  formattedRow.supplierId = supplier.id
                } else {
                  formattedRow.supplier.isNew = true
                }
              }

              formattedRows.push(formattedRow)
            }
          }
        }

        fs.writeFileSync(path.join(tmpPath, 'import-delivery.json'), JSON.stringify({ deliveries: formattedRows }, null, 2))
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
      const importFilePath = path.join(tmpPath, 'import-delivery.json')

      if (fs.existsSync(importFilePath)) {
        const jsonStr = fs.readFileSync(importFilePath)
        if (JSON.parse(jsonStr)) {
          const jsonData = JSON.parse(jsonStr)
          const deliveries = jsonData.deliveries

          let successCount = 0
          const dataCount = deliveries.length
          const errors = []

          for (let i = 0; i < deliveries.length; i++) {
            const delivery = deliveries[i]

            if (delivery.supplier.isNew) {
              const supplier = await Supplier.findByCode(delivery.supplier.code).catch(err => {
                errors.push(err)
              })

              if (supplier) {
                delivery.supplierId = supplier.id
              } else {
                await db.exec('INSERT INTO suppliers (`code`, `name`) VALUES (:code, :name)', {
                  code: delivery.supplier.code,
                  name: delivery.supplier.name
                }, 'INSERT').then(data => {
                  delivery.supplierId = data[0]
                }).catch(err => {
                  errors.push(err)
                })
              }
            }

            if (delivery.ok) {
              await Delivery.insert(delivery).then(success => {
                if (success) {
                  successCount += 1
                }
              }).catch(err => {
                errors.push({
                  data: delivery,
                  error: err
                })
              })
            } else {
              errors.push({
                data: delivery,
                message: `transaction number ${delivery.transactionNumber} already exists`
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
        reject({ message: 'imports-delivery.json file does not exists' })
      }
    })
  }
}

module.exports = Delivery
