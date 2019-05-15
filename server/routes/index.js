const router = require('express').Router()

router.get('/check', async (req, res) => {
  res.json({
    ok: true,
    msg: 'server is running'
  })
})

module.exports = router
