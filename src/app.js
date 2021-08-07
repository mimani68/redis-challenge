const express           = require( 'express' )
const { StreamHandler } = require('./common/stream-class/stream.class')
const Redis             = require('./common/redis/redis')

const app = express()

const STREAM_TITLE = 'mystream'
Redis.initRedis({
  host:     process.env.REDIS_PATH,
  password: process.env.REDIS_PASSWORD
})

app.get('', async (req, res)=>{
  let e = new StreamHandler()
  e.GetStreams(STREAM_TITLE)
    .then( o => {
      res.json({msg: 'done', data: o})
    })
    .catch( err => {
      res.json({msg: 'error', data: err})
    })
})

app.post('', async (req, res)=>{
  let e = new StreamHandler()
  let value = { time: new Date().toISOString() }
  e.SetStreams(STREAM_TITLE, value)
    .then( o => {
      res.json({msg: 'done', data: o})
    })
    .catch( err => {
      res.json({msg: 'error', data: err})
    })
})

module.exports = app
