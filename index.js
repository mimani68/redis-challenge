let { log }           = require('./src/common/logs')
let { StreamHandler } = require('./src/app')
let { redisClient }   = require('./src/common/redis/redis')
let STREAM_ENUM       = require('./src/config/event')

// Initial setup
let app = new StreamHandler(redisClient) 
app.createStream(STREAM_ENUM)

// Event `Start`
let startEvent = new StreamHandler(redisClient)
startEvent
  .defineVariables(STREAM_ENUM.START)
  .defineGroup()
  .listen( result =>{
    log(`[EVENT] ${ STREAM_ENUM.START }`)
    log('store result in database ' + result.id)
  })

// Event `Login`
let loginEvent = new StreamHandler(redisClient) 
loginEvent
  .defineVariables(STREAM_ENUM.LOGIN)
  .defineGroup()
  .listen( result =>{
    log(`[EVENT] ${ STREAM_ENUM.LOGIN }`)
    log('store result in database ' + result.id)
    let payload = { state: 'User login' }
    loginEvent.sendMessage(STREAM_ENUM.PROFILE_UPDTAE_STATE, payload) 
  })

// Event `Sign in`
let SignInEvent = new StreamHandler(redisClient) 
SignInEvent
  .defineVariables(STREAM_ENUM.SIGN_IN)
  .defineGroup()
  .listen( result =>{
    log(`[EVENT] ${ STREAM_ENUM.SIGN_IN }`)
    log('store result in database ' + result.id)
    let payload = { state: 'User unverified' }
    SignInEvent.sendMessage(STREAM_ENUM.FIRST_CHARGE, payload)  
  })
