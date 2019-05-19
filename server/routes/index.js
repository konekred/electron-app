const fs = require('fs')
const fsextra = require('fs-extra')
const path = require('path')
const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'tmp' })
const tmpPath = path.resolve('tmp')

const root = process.cwd()
const db = require(`${root}/server/database`)
const settings = require(`${root}/config/settings`)
const logger = require(`${root}/logger/app`)

const Supplier = require(`${root}/server/models/Supplier`)
const Delivery = require(`${root}/server/models/Delivery`)

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
  const saveImport = await Supplier.saveImport().catch(err => {
    logger.error(`/suppliers/save-import : ${err}`)
    res.json({ ok: false })
  })

  fsextra.emptyDirSync(tmpPath)

  res.json({
    ok: saveImport.ok,
    successCount: saveImport.successCount,
    errors: saveImport.errors
  })
})


router.post('/deliveries/import', upload.single('file'), async (req, res) => {
  const { body, file } = req
  const rows = await Delivery.csvReader(file.path, true).catch(err => {
    logger.error(err)
  })

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
