const root = '../..'
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const db = require('../database')
const CsvReader = require(`${root}/lib/CsvReader`)
const fieldsExists = require(`${root}/lib/helpers/fieldsExists`)
const tmpPath = path.resolve('tmp')
const Supplier = require('./Supplier')

class Delivery {
  static findByInvoiceNumber(invoiceNumber) {
    return new Promise((resolve, reject) => {
      db.queryFirst('SELECT `id`, `invoiceNumber` FROM `deliveries` WHERE `invoiceNumber` = :invoiceNumber LIMIT 1', { invoiceNumber }).then(delivery => {
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
          invoiceNumber,
          supplierId,
          \`amount\`,
          \`date\`
        ) VALUES (
          :invoiceNumber,
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
        reject(err)
      })
    })
  }


  static csvReader(filepath, validate = false) {
    return new Promise((resolve, reject) => {
      const csvReader = new CsvReader(filepath)

      csvReader.read().then(async (rows) => {
        const errors = []

        if (validate) {
          let isValidCsvFormat = false

          if (rows.length > 0) {
            isValidCsvFormat = fieldsExists(['date', 'invoiceNumber', 'supplier', 'amount'], rows[0])
          }

          if (isValidCsvFormat) {
            for (let i = 0; i < rows.length; i++) {
              const row = rows[i]

              row.ok = true
              row.date = moment(row.date, 'D-MMM-YY').format('YYYY-MM-DD')
              row.amount = parseFloat(row.amount.replace(/,/g, ''))

              if (row.supplier && row.invoiceNumber) {
                row.supplier = row.supplier.trim()

                await Delivery.findByInvoiceNumber(row.invoiceNumber).then(delivery => {
                  if (delivery) {
                    row.ok = false
                  }
                }).catch(err => {
                  errors.push(err)
                })

                const supplier = await Supplier.findByName(row.supplier).catch(err => {
                  errors.push(err)
                })

                if (supplier) {
                  row.supplierId = supplier.id
                  row.isNewSupplier = false
                } else {
                  row.isNewSupplier = true
                }
              }
            }
          }
        }

        fs.writeFileSync(path.join(tmpPath, 'import-delivery.json'), JSON.stringify({ deliveries: rows }, null, 2))
        resolve({
          rows,
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

            if (delivery.isNewSupplier) {
              await db.exec('INSERT INTO suppliers (`name`) VALUES (:name)', { name: delivery.supplier }, 'INSERT').then(data => {
                delivery.supplierId = data[0]
              }).catch(err => {
                errors.push(err)
              })
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
                message: `invoice number ${delivery.invoiceNumber} already exists`
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
