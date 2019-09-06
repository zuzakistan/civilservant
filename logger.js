const winston = require('winston')

const levels = { // lower numbers are more severe
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  },
  colors: {
    debug: 'cyan',
    error: 'white redBG',
    info: 'blue',
    silly: 'gray',
    verbose: 'green',
    warn: 'yellow'
  }
}
winston.addColors(levels.colors)

const logger = winston.createLogger({
  levels: levels.levels,
  format: winston.format.combine(
    winston.format.padLevels(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({level: 'verbose'})
  ]
})

module.exports = logger.log.bind(logger) // winston issue #1062
