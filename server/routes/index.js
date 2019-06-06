const fs = require('fs')
const fsextra = require('fs-extra')
const path = require('path')
const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'tmp' })
const tmpPath = path.resolve('tmp')

const root = '../..'
const db = require(`${root}/server/database`)
const settings = require(`${root}/config/settings`)
const logger = require(`${root}/logger/app`)

const Supplier = require(`${root}/server/models/Supplier`)
const Delivery = require(`${root}/server/models/Delivery`)
const BadOrder = require(`${root}/server/models/BadOrder`)

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


router.post('/suppliers/import', upload.single('file'), (req, res) => {
  const { file } = req
  Supplier.csvReader(file.path, true).then(({ rows, errors }) => {
    res.json({ ok: true, rows, errors })
  }).catch(err => {
    logger.error(err)
    res.json({ ok: false, rows: [] })
  })
})


router.post('/suppliers/save-import', (req, res) => {
  Supplier.saveImport().then(({ ok, successCount, errors }) => {
    fsextra.emptyDirSync(tmpPath)
    res.json({ ok, successCount, errors })
  }).catch(err => {
    logger.error(err)
    res.json({ ok: false })
  })
})


router.post('/deliveries/import', upload.single('file'), (req, res) => {
  const { file } = req
  Delivery.csvReader(file.path, true).then(({ rows, errors }) => {
    res.json({ ok: true, rows, errors })
  }).catch(err => {
    logger.error(err)
    res.json({ ok: false, rows: [] })
  })
})


router.post('/deliveries/save-import', (req, res) => {
  Delivery.saveImport().then(({ ok, successCount, errors }) => {
    fsextra.emptyDirSync(tmpPath)
    res.json({ ok, successCount, errors })
  }).catch(err => {
    logger.error(err)
    res.json({ ok: false })
  })
})


router.post('/bad-orders/import', upload.single('file'), (req, res) => {
  const { file } = req
  BadOrder.csvReader(file.path, true).then(({ rows, errors }) => {
    res.json({ ok: true, rows, errors })
  }).catch(err => {
    logger.error(err)
    res.json({ ok: false, rows: [] })
  })
})


router.post('/bad-orders/save-import', (req, res) => {
  BadOrder.saveImport().then(({ ok, successCount, errors }) => {
    fsextra.emptyDirSync(tmpPath)
    res.json({ ok, successCount, errors })
  }).catch(err => {
    logger.error(err)
    res.json({ ok: false })
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
