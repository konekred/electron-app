const path = require('path')
const express = require('express')
const graphQLHttp = require('express-graphql')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const root = process.cwd()
const settings = require(`${root}/config/settings`)
const logger = require(`${root}/logger/app`)
const publicPath = path.resolve('public')

const routes = require('./routes')
const graphQLSchema = require('./graphql')

const PORT = process.env.PORT ? process.env.PORT : settings.server.port
const app = express()

app.use(cors())
app.use(cookieParser())
app.use(session(settings.session))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(publicPath))

app.use('/', routes)

app.use('/graphql', graphQLHttp(() => ({
  schema: graphQLSchema,
  pretty: true,
  graphiql: true
})))

// SPA fallback
app.get('/*', (req, res) => {
  const indexHtmlPath = path.resolve('public/index.html')
  res.sendFile(indexHtmlPath)
})

app.listen(PORT, () => {
  logger.info(`app started http://localhost:${PORT}`)
})
