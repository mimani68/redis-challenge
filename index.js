let { log }           = require('./src/common/logs')
let { StreamHandler } = require('./src/app')
let config            = require('./src/config/redis')
let STREAM_ENUM       = require('./src/config/event')


let app = new StreamHandler(config) 

app.createStream(STREAM_ENUM)

app
  .defineVariables(STREAM_ENUM.START)
  .defineGroup()
  .listen( result =>{
    log(`[EVENT] ${ STREAM_ENUM.START }`)
    log('store result in database ' + result.id)
  })

// app
//   .defineVariables(STREAM_ENUM.LOGIN)
//   .defineGroup()
//   .listen( result =>{
//     log(`[EVENT] ${ STREAM_ENUM.LOGIN }`)
//     log('store result in database ' + result.id)
//     let payload = { state: 'User login' }
//     app.sendMessage(STREAM_ENUM.PROFILE_UPDTAE_STATE, payload) 
//   })

// app
//   .defineVariables(STREAM_ENUM.SIGN_IN)
//   .defineGroup()
//   .listen( result =>{
//     log(`[EVENT] ${ STREAM_ENUM.SIGN_IN }`)
//     log('store result in database ' + result.id)
//     let payload = { state: 'User unverified' }
//     app.sendMessage(STREAM_ENUM.FIRST_CHARGE, payload)  
//   })



setTimeout(_=>{
  log(`[SENT] send sample event to "${ STREAM_ENUM.SIGN_IN }" after 6000ms`)
  let payload = { user: 'mahdi', email: 'info@server.io', password: '123' }
  app.sendMessage(STREAM_ENUM.SIGN_IN, payload)
}, 6000)

setTimeout(_=>{
  log(`[SENT] send sample event to "${ STREAM_ENUM.LOGIN }" after 10000ms`)
  let payload = { user: 'mahdi', email: 'info@server.io', password: '123' }
  app.sendMessage(STREAM_ENUM.LOGIN, payload)
}, 10000)

setTimeout(_=>{
  log(`[SENT] send sample event to "${ STREAM_ENUM.START }" after 15000ms`)
  let payload = { version: '1.2' }
  app.sendMessage(STREAM_ENUM.START, payload)
}, 15000)