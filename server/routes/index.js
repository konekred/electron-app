const path = require('path')
const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'tmp' })
const CsvReader = require('../../lib/CsvReader')
const settings = require('../../config/settings')
const Supplier = require('../models/Supplier')


router.get('/check', (req, res) => {
  res.json({
    ok: true,
    msg: 'server is running',
    root: process.cwd(),
    resolve: path.resolve('konekred')
  })
})

router.post('/sql', async (req, res) => {
  try {
    const sql = req.body.query

    let ok = false
    let results = []

    if (sql) {
      if (/^(insert|update)/.test(sql.toLowerCase())) {
        const execQuery = await db.exec(sql)
        if (execQuery) {
          ok = true
        }
      } else if (/^select/.test(sql.toLowerCase())) {
        const execQuery = await db.query(sql)
        ok = true
        results = execQuery
      }
    }

    res.json({
      ok,
      sql,
      results
    })

  } catch (err) {
    res.json({
      ok: false,
      error: err,
      results: []
    })
  }
})

router.post('/suppliers/import', upload.single('file'), async (req, res) => {
  const { body, file } = req

  const csvReader = new CsvReader(file.path)
  const rows = await csvReader.read()

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].name) {
      const supplier = await Supplier.findByName(rows[i].name)

      if (supplier) {
        rows[i].ok = false
        rows[i].errors = [
          {
            message: 'supplier already exists'
          }
        ]
      } else {
        rows[i].ok = true
      }
    } else {
      rows[i].ok = false
      rows[i].errors = [
        {
          message: 'supplier does not have a name'
        }
      ]
    }
  }

  req.session.importSupplierRows = rows

  res.json({
    ok: true,
    path: file.path,
    body: body,
    rows: rows
  })
})

router.get('/settings', async (req, res) => {
  res.json(settings)
})

module.exports = router
