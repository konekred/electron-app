const log4js = require('log4js')
const logger = log4js.getLogger('app')

log4js.configure({
  appenders: {
    app: {
      type: 'console',
      filename: 'logs/app.log',
      maxLogSize: 10485760
    }
  },
  categories: {
    default: { appenders: ['app'], level: 'all' },
    app: {
      appenders: ['app'],
      level: 'all'
    }
  }
})

module.exports = logger
