let { log }           = require('./common/logs')
let { StreamHandler } = require('./common/stream/stream.class')
let { redisClient }   = require('./common/redis/redis')
let STREAM_ENUM       = require('./config/event')

let app = new StreamHandler(redisClient)
log(`Event "${ STREAM_ENUM.SIGN_IN }" send to server`)
let payload = { user: 'Alison', email: 'info@server.io', password: '123' }
app.sendMessage(STREAM_ENUM.SIGN_IN, payload)
setTimeout(_=>{
  process.exit()
}, 5000)