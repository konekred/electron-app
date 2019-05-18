// start: csv reader

const CsvReader = require('../lib/CsvReader')
const db = require('../server/database')

const csv = new CsvReader('C:/Users/ark/Desktop/dummy/Suppliers.csv')
csv.read().then(async (rows) => {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    if (row.name) {
      const supplier = await db.query('SELECT TOP 1 * FROM Suppliers WHERE [name] = ?', [row.name], { first: true }).catch(err => {
        console.log(err)
      })

      if (!supplier) {
        // insert supplier
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
      } else {
        // update supplier
      }
    }
  }

  console.log('Finish Importing Data')
})

// end: csv reader
