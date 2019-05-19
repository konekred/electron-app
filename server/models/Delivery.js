const root = process.cwd()
const fs = require('fs')
const path = require('path')
const db = require('../database')
const CsvReader = require(`${root}/lib/CsvReader`)
const fieldsExists = require(`${root}/lib/helpers/fieldsExists`)
const tmpPath = path.resolve('tmp')
const Supplier = require('./Supplier')

class Delivery {
  static insert(data) {
    return new Promise((resolve, reject) => {
      if (fieldsExists(['invoiceNumber', 'supplierId', 'amount', 'date'], data)) {
        const sql = `
          INSERT INTO [Deliveries] (
            [invoiceNumber],
            [supplierId],
            [amount],
            [date]
          )
          VALUES (?, ?, ?, ?)
        `
        const params = [
          data.invoiceNumber,
          data.supplierId,
          data.amount,
          data.date
        ]

        db.exec(sql, params).then(success => {
          resolve(success)
        }).catch(err => {
          reject(err)
        })

      } else {
        reject({ message: 'did not meet required fields' })
      }
    })
  }


  static csvReader(filepath, validate = false) {
    return new Promise(async (resolve, reject) => {
      try {
        const csvReader = new CsvReader(filepath)
        const rows = await csvReader.read()

        if (validate) {
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].supplier) {
              const supplier = await Supplier.findByName(rows[i].supplier)
              rows[i].ok = true

              if (supplier) {
                rows[i].supplierId = supplier.id
              } else {
                const insertSupplier = await Supplier.insertAndFind({ name: rows[i].supplier })
                rows[i].supplierId = insertSupplier.id
              }
            } else {
              rows[i].ok = false
              rows[i].errors = [
                {
                  message: 'supplier does not have a name'
                }
              ]
            }
          }
        }

        fs.writeFileSync(path.join(tmpPath, 'import-deliveries.json'), JSON.stringify({ deliveries: rows }, null, 2))
        resolve(rows)

      } catch (err) {
        reject(err)
      }
    })
  }


  static saveImport() {
  //   return new Promise(async (resolve, reject) => {
  //     const importFilePath = path.join(tmpPath, 'import-suppliers.json')

  //     if (fs.existsSync(importFilePath)) {
  //       const suppliersJsonStr = fs.readFileSync(importFilePath)
  //       if (JSON.parse(suppliersJsonStr)) {
  //         const jsonData = JSON.parse(suppliersJsonStr)
  //         const suppliers = jsonData.suppliers

  //         let successCount = 0
  //         const dataCount = suppliers.length
  //         const errors = []

  //         for (let i = 0; i < suppliers.length; i++) {
  //           const supplier = suppliers[i]
  //           if (supplier.ok) {
  //             await Supplier.insert(supplier).then(success => {
  //               if (success) {
  //                 successCount += 1
  //               }
  //             }).catch(err => {
  //               errors.push({
  //                 data: supplier,
  //                 error: err
  //               })
  //             })
  //           } else {
  //             errors.push({
  //               data: supplier,
  //               message: `${supplier.name} already exists`
  //             })
  //           }
  //         }

  //         fs.unlinkSync(importFilePath)

  //         resolve({
  //           ok: true,
  //           successCount,
  //           dataCount,
  //           errors
  //         })
  //       }
  //     } else {
  //       reject({ message: 'imports-supplier.json file does not exists' })
  //     }
  //   })
  }
}

module.exports = Delivery
