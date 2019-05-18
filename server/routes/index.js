const fs = require('fs')
const fsextra = require('fs-extra')
const path = require('path')
const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'tmp' })

const db = require('../database')
const settings = require('../../config/settings')
const Supplier = require('../models/Supplier')
const tmpPath = path.resolve('tmp')

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
  const rows = await Supplier.csvReader(file.path, true)

  res.json({
    ok: true,
    path: file.path,
    body: body,
    rows: rows
  })
})


router.post('/suppliers/save-import', async (req, res) => {
  try {
    const importResult = await Supplier.saveImport()

    res.json({
      ok: importResult.ok,
      successCount: importResult.successCount
    })
  } catch (err) {
    res.json({
      ok: false,
      error: err
    })
  }
})


router.get('/settings', async (req, res) => {
  res.json(settings)
})


router.post('/clean', async (req, res) => {
  try {
    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath)
    } else {
      fsextra.emptyDirSync(tmpPath)
    }

    res.json({
      ok: true,
      message: 'tmp folder has been clean'
    })
  } catch (err) {
    res.json({
      ok: false,
      error: err
    })
  }
})

module.exports = router
