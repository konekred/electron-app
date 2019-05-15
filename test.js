
// // start: database sample
// const connectionString = 'Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:/Users/ark/Desktop/PaySight.mdb;'
// const Database = require('./lib/Database')
// const db = new Database(connectionString)

// db.query('SELECT * FROM Dummy', ['%Zoei']).then(data => {
//   console.log(data)
// })

// db.exec('INSERT INTO Dummy (FirstName, LastName) VALUES(?, ?)', ['Arielle Marie', 'Andrade']).then(success => {
//   console.log(success)
// })
// // end: database sample



// // start: excel exporter sample
// const ExcelExporter = require('./lib/ExcelExporter')
// const excel = new ExcelExporter('C:/Users/ark/Desktop/dummy/bad-orders.xlsx')
// excel.read().then(worksheets => {
//   console.log(worksheets)
// })
// // start: excel exporter sample


const CsvReader = require('./lib/CsvReader')

const csv = new CsvReader('C:/Users/ark/Desktop/dummy/Suppliers.csv')
csv.read().then(rows => {
  console.log(rows)
})
