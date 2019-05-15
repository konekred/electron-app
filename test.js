
// start: database sample
// const connectionString = 'Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:/database/PaySight.mdb;'
// const Database = require('./lib/Database')
// const db = new Database(connectionString)

// db.query('SELECT * FROM Dummy').then(data => {
//   console.log(data)
// }).catch(err => {
//   console.log(err)
// })

// db.exec('INSERT INTO Dummy (FirstName, LastName) VALUES(?, ?)', ['Arielle Marie', 'Andrade']).then(success => {
//   console.log(success)
// })
// end: database sample







// // start: app db call
// const db = require('./server/database')
// db.query('SELECT TOP 1 * FROM Dummy WHERE id = 123', null, true).then(rows => {
//   console.log(rows)
// })
// // end: app db call








// // start: excel exporter sample
// const ExcelExporter = require('./lib/ExcelExporter')
// const excel = new ExcelExporter('C:/Users/ark/Desktop/dummy/bad-orders.xlsx')
// excel.read().then(worksheets => {
//   console.log(worksheets)
// })
// // start: excel exporter sample
















// const db = require('./server/database')
// const insert = false

// if (insert) {
//   db.exec('INSERT INTO Dummy (FirstName, LastName, [Date]) VALUES (?, ?, ?)', ['Wilson\'s', 'Anciro', new Date()], { logging: true }).then(data => {
//     console.log(data)
//   })
// } else {
//   db.query('SELECT * FROM Dummy WHERE firstName LIKE ?', ['Wilson\'s'], { logging: true }).then(data => {
//     console.log(data)
//   })
// }



// start: csv reader
const CsvReader = require('./lib/CsvReader')
const db = require('./server/database')

const csv = new CsvReader('C:/Users/ark/Desktop/dummy/Suppliers.csv')
csv.read().then(async (rows) => {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    if (row.name) {
      const supplier = await db.query('SELECT TOP 1 * FROM Suppliers WHERE [name] = ?', [row.name], { first: true }).catch(err => {
        console.log(err)
      })

      if (!supplier) {
        await db.exec(`
          INSERT INTO Suppliers(
            [name],
            [address],
            [TIN],
            [taxClass],
            [code],
            [principal],
            [terms],
            [contactNumber],
            [email],
            [representative],
            [representativeContact]
          )
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          row.name,
          row.address,
          row.TIN,
          row.taxClass,
          row.code,
          row.principal,
          row.terms,
          row.contactNumber,
          row.email,
          row.representative,
          row.representativeContact
        ]).then(success => {
          if (success) {
            console.log(`INSERT: ${row.name}`)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }

  console.log('Finish Importing Data')
})
// end: csv reader


