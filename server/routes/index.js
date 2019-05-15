const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'tmp/' })
const CsvReader = require('../../lib/CsvReader')

router.get('/check', (req, res) => {
  res.json({
    ok: true,
    msg: 'server is running'
  })
})

router.post('/upload', upload.single('excel'), async (req, res) => {
  const { body, file } = req

  const csvReader = new CsvReader(file.path)
  const rows = await csvReader.read()

  res.json({
    ok: true,
    path: '/upload',
    body: body,
    rows: rows
  })
})

module.exports = router
