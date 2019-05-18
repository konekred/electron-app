const db = require('../database')

class Supplier {
  static findByName(name) {
    return new Promise((resolve, reject) => {
      db.query('SELECT [id], [code], [name] FROM [Suppliers] WHERE [name] LIKE ?', [name], { first: true }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = Supplier
