const path = require('path')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const settings = require('../config/settings')
const routes = require('./routes')
const publicPath = path.join(__dirname, '/../public')

const PORT = process.env.PORT ? process.env.PORT : settings.server.port

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(session(settings.session))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(publicPath))

app.use('/', routes)

// SPA fallback
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../public/index.html'))
})

app.listen(PORT, () => {
  console.log(publicPath)
  console.log(`app started http://localhost:${PORT}`)
})
