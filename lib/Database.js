const ADODB = require('node-adodb')
const SQLString = require('sqlstring')

class Database {
  constructor(connectionString) {
    this.connectionString = connectionString
    this.connection = ADODB.open(this.connectionString)
  }

  query(sql, params) {
    return new Promise(async (resolve, reject) => {
      const sqlQuery = SQLString.format(sql, params)

      this.connection.query(sqlQuery).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  exec(sql, params) {
    return new Promise(async (resolve, reject) => {
      const sqlQuery = SQLString.format(sql, params)

      this.connection.execute(sqlQuery).then(() => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = Database
