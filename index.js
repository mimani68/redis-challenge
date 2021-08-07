let { log }           = require('./src/common/logs')
let { StreamHandler } = require('./src/app')
let config            = require('./src/config/redis')
let STREAM_ENUM       = require('./src/config/event')


let app = new StreamHandler(config)

app.createStream(STREAM_ENUM)

app
  .defineVariables(STREAM_ENUM.SIGN_IN)
  .defineGroup()
  .listen( result =>{
    log('[EVENT] app:profile:sign-in ')
    log('store result in database ' + result.id)
    app.sendMessage(STREAM_ENUM.FIRST_CHARGE)  
  })

app
  .defineVariables(STREAM_ENUM.LOGIN)
  .defineGroup()
  .listen( result =>{
    log('[EVENT] app:profile:login ')
    log('store result in database ' + result.id)
    app.sendMessage(STREAM_ENUM.PROFILE_UPDTAE_STATE) 
  })

setTimeout(_=>{
  log('[EVENT] send sample event to `app:profile:login` after 6000ms')
  app.sendMessage(STREAM_ENUM.LOGIN)
}, 6000)