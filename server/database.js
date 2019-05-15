const settings = require('../config/settings')
const Database = require('../lib/Database')

class AppDB extends Database {
  constructor(connectionString) {
    super(connectionString)

    if (AppDB.instance) {
      return AppDB.instance
    }

    AppDB.instance = this
    return this
  }
}

const mainDB = new AppDB(settings.database.connectionString)

module.exports = mainDB
