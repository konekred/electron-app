const root = '..'
const Sequelize = require('sequelize')
const settings = require(`${root}/config/settings.json`)

const host = settings.database.host
const dbname = settings.database.database
const username = settings.database.username
const password = settings.database.password

const sequelize = new Sequelize(dbname, username, password, {
  host: host,
  dialect: 'mysql',
  pool: {
    max: 70,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
})

class AppDB {
  static query(sql, replacements) {
    return new Promise((resolve, reject) => {
      sequelize.query(sql, { type: 'SELECT', replacements }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  static queryFirst(sql, replacements) {
    return new Promise((resolve, reject) => {
      sequelize.query(sql, { type: 'SELECT', replacements }).then(data => {
        if (data.length == 1) {
          resolve(data[0])
        } else {
          resolve(null)
        }

      }).catch(err => {
        reject(err)
      })
    })
  }

  static exec(sql, replacements, type) {
    return new Promise((resolve, reject) => {
      sequelize.query(sql, { type, replacements }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = AppDB
