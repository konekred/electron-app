const Excel = require('exceljs')

class ExcelExporter {
  constructor(filename) {
    this.filename = filename
    this.worksheets = []
  }

  async read() {
    const workbook = new Excel.Workbook()
    await workbook.xlsx.readFile(this.filename).then(() => {
      workbook.eachSheet((worksheet, sheetId) => {
        if (worksheet.state == 'visible') {
          const worksheetData = {
            id: sheetId,
            name: worksheet.name,
            columnCount: worksheet.columnCount,
            rowCount: worksheet.rowCount,
            rows: []
          }

          worksheet.eachRow((row) => {
            const rowValues = row.values
            rowValues.shift()
            worksheetData.rows.push(rowValues)
          })

          this.addWorkSheet(worksheetData)
        }
      })
    })

    return this.worksheets
  }

  addWorkSheet(workSheet) {
    this.worksheets.push(workSheet)
  }
}

module.exports = ExcelExporter
