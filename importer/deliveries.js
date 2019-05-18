// start: csv reader

const CsvReader = require('../lib/CsvReader')
const db = require('../server/database')

const csv = new CsvReader('C:/Users/ark/Desktop/dummy/Deliveries.csv')
csv.read().then(async (rows) => {
  for (let i = 0; i < rows.length; i++) {
    try {
      const row = rows[i]

      if (row.supplier) {
        let supplier = await db.query('SELECT TOP 1 * FROM Suppliers WHERE [name] = ?', [row.supplier], { first: true }).catch(err => {
          console.log('ERROR FETCHING Supplier', err)
        })

        if (!supplier) {
          await db.query('INSERT INTO [Suppliers] ([name]) VALUES (?)', [row.supplier], { logging: true }).catch(err => {
            console.log('ERROR INSERTING Supplier', err)
          })

          supplier = await db.query('SELECT TOP 1 * FROM Suppliers WHERE [name] = ?', [row.supplier], { first: true }).catch(err => {
            console.log('ERROR RE FETCHING Supplier', err)
          })
        }


        if (!supplier) {
          console.log(row.supplier)
        }
      }

    } catch (err) {
      console.log(err)
    }
  }

  console.log('Finish Importing Deliveries')
})

// end: csv reader
