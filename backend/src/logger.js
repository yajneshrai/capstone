const pino = require('pino');
const pinoLogger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'req,res,responseTime',
      }
    }
  })

module.exports = pinoLogger;