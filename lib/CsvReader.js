const csv = require('csvtojson')

class CsvReader {
  constructor(fileName) {
    this.fileName = fileName
    this.rows = []
  }

  read() {
    return new Promise((resolve, reject) => {
      csv().fromFile(this.fileName).then(rows => {
        resolve(rows)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = CsvReader
