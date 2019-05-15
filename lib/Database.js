const ADODB = require('node-adodb')
const SQLString = require('./helpers/SqlString')

class Database {
  constructor(connectionString) {
    this.connectionString = connectionString
    this.connection = ADODB.open(this.connectionString)
    this.logging = false
  }

  query(sql, params, options = {}) {
    return new Promise(async (resolve, reject) => {
      const sqlQuery = this.toSql(sql, params, options)

      this.connection.query(sqlQuery).then(data => {
        if (options.first) {
          if (data.length == 1) {
            resolve(data[0])
          }
          resolve(null)
        }
        resolve(data)

      }).catch(err => {
        reject(err)
      })
    })
  }

  exec(sql, params, options = {}) {
    return new Promise(async (resolve, reject) => {
      const sqlQuery = this.toSql(sql, params, options)

      this.connection.execute(sqlQuery).then(() => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  }

  toSql(sql, params, options = {}) {
    SQLString.isMsAccess(true)
    const sqlQuery = SQLString.format(sql, params)

    if (this.logging || options.logging) {
      if (options.logger) {
        options.logger(sqlQuery)
      } else {
        console.log(sqlQuery)
      }
    }

    return sqlQuery
  }
}

module.exports = Database
