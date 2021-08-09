const assert = require('assert');
const { strictEqual } = require('assert');

process.env.REDIS_PATH = 'localhost'
process.env.REDIS_PASSWORD = 'bnf9cU34naC9'

let { log }           = require('../src/common/logs')
let { StreamHandler } = require('../src/common/stream/stream.class')
let { redisClient }   = require('../src/common/redis/redis')
let STREAM_ENUM       = require('../src/config/event');

describe('Stream', function() {

  before(function() {
    // let app = new StreamHandler(redisClient) 
    // app.createStream(STREAM_ENUM)
    
    // Event `Start`
    let startEvent = new StreamHandler(redisClient)
    startEvent
      .defineVariables(STREAM_ENUM.START)
      .defineGroup()
      .listen( req =>{
        log(`[EVENT] ${ STREAM_ENUM.START } - ${ req.id }`)
        log('store result in database ' + req.id)
      })
  })

  describe('Check redis connectivity', function() {
    it('PING', function(done) {
      redisClient.INFO( (err, data) =>{
        if (err)
          assert(null);
        done()
      })
    });
  });

  describe('Send event', function() {

    it('should send event `' + STREAM_ENUM.START + '`', function(done) {
      const payload        = { date: new Date().toDateString() }
      const event          = STREAM_ENUM.START
      const STREAMS_KEY    = event
      const APPLICATION_ID = "app:node:1"
      const CONSUMER_ID    = "consumer:1"

      let app = new StreamHandler(redisClient)
      app.sendMessage(event, payload)

      redisClient.xreadgroup('GROUP', APPLICATION_ID, CONSUMER_ID, 'BLOCK', 500, 'STREAMS', STREAMS_KEY, '>', function (err, stream) {
        if (err)
          assert(false);
        done()
      })
    });

    it('should send event `' + STREAM_ENUM.LOGIN + '`', function(done) {
      const payload        = { user: 'Edardo', email: 'eduard@customer.io', password: '123' }
      const event          = STREAM_ENUM.LOGIN
      const STREAMS_KEY    = event
      const APPLICATION_ID = "app:node:1"
      const CONSUMER_ID    = "consumer:1"

      let app = new StreamHandler(redisClient)
      app.sendMessage(event, payload)

      redisClient.xreadgroup('GROUP', APPLICATION_ID, CONSUMER_ID, 'BLOCK', 500, 'STREAMS', STREAMS_KEY, '>', function (err, stream) {
        if (err)
          assert(false);
        strictEqual(stream[0][0] === event, true, 'Invalid event');
        strictEqual(stream[0][1][0][1].some(el => el === payload.user), true, 'Field user dose not exists');
        strictEqual(stream[0][1][0][1].some(el => el === payload.email), true, 'Field email dose not exists');
        strictEqual(stream[0][1][0][1].some(el => el === payload.password), true, 'Field password dose not exists');
        done()
      })
    });

    it('should send event `' + STREAM_ENUM.SIGN_IN + '`', function(done) {
      const payload        = { user: "Eliza", password: "123" }
      const event          = STREAM_ENUM.SIGN_IN
      const STREAMS_KEY    = event
      const APPLICATION_ID = "app:node:1"
      const CONSUMER_ID    = "consumer:1"

      let app = new StreamHandler(redisClient)
      app.sendMessage(event, payload)

      redisClient.xreadgroup('GROUP', APPLICATION_ID, CONSUMER_ID, 'BLOCK', 500, 'STREAMS', STREAMS_KEY, '>', function (err, stream) {
        if (err)
          strictEqual(null);
        done()
      })
    });

    it('exit from test', function(done) {
      process.exit()
    })
  });

});