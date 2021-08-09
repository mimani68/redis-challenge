let { log }           = require('./common/logs')
let { StreamHandler } = require('./common/stream/stream.class')
let { redisClient }   = require('./common/redis/redis')
let STREAM_ENUM       = require('./config/event')
let { User }          = require('./model/user')

// Initial setup
let app = new StreamHandler(redisClient) 
app.createStream(STREAM_ENUM)

// Event `Start`
let startEvent = new StreamHandler(redisClient)
startEvent
  .defineVariables(STREAM_ENUM.START)
  .defineGroup()
  .listen( req =>{
    log(`[EVENT] ${ STREAM_ENUM.START } - ${ req.id }`)
    log('store result in database ' + req.id)
  })

// Event `Login`
let loginEvent = new StreamHandler(redisClient) 
loginEvent
  .defineVariables(STREAM_ENUM.LOGIN)
  .defineGroup()
  .listen( req =>{
    log(`[EVENT] ${ STREAM_ENUM.LOGIN } - ${ req.id }`)
    let payload = { state: 'User login' }
    loginEvent.sendMessage(STREAM_ENUM.PROFILE_UPDTAE_STATE, payload) 
  })

// Event `Sign in`
let SignInEvent = new StreamHandler(redisClient) 
SignInEvent
  .defineVariables(STREAM_ENUM.SIGN_IN)
  .defineGroup()
  .listen( req =>{
    log(`[EVENT] ${ STREAM_ENUM.SIGN_IN } - ${ req.id }`)
    /**
     * 
     * Notify other services that new request is incoming
     * 
     */
    let payload = { state: 'User unverified' }
    SignInEvent.sendMessage(STREAM_ENUM.FIRST_CHARGE, payload)
    /**
     * 
     * Store user as HashMap inredis
     * 
     */
    let u = new User(req.user, req.email, req.password)
    u.save()
  })
