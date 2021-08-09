let { log }           = require('./src/common/logs')
let { StreamHandler } = require('./src/app')
let { redisClient }   = require('./src/common/redis/redis')
let STREAM_ENUM       = require('./src/config/event')

let app = new StreamHandler(redisClient)
log(`Event "${ STREAM_ENUM.SIGN_IN }" send to server`)
let payload = { user: 'Alison', email: 'info@server.io', password: '123' }
app.sendMessage(STREAM_ENUM.SIGN_IN, payload)
setTimeout(_=>{
  process.exit()
}, 5000)