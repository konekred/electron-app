const path = require('path')
const express = require('express')
const cors = require('cors')

const settings = require('../config/settings')
const app = express()
const PORT = process.env.PORT ? process.env.PORT : settings.server.port
app.use(cors())
app.get('/', (req, res) => {
  res.send('index')
})
app.use(express.static(path.join(__dirname, '/../public')))
app.listen(PORT, () => {
  console.log(`web server started http://localhost:${PORT}`)
})
