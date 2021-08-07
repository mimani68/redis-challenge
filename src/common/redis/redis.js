const { promisify } = require("util");
const redis = require("redis");

const { log } = require('../logs')

let cmd;

function initRedis(options) {
  const client = redis.createClient(options);
  cmd = promisify(client.sendCommand).bind(client);
}

async function getStream(streamName) {
  if ( !cmd ) {
    log('Redis is not connected')
    return null
  }
  return await cmd("XREAD", ["STREAMS", streamName, 0])
}

async function sendStream(streamName, value) {
  if ( !cmd ) {
    log('Redis is not connected')
    return null
  }
  let arg = [streamName, '*']
  for ( let key in value ) {
    arg.push(key)
    arg.push(value[key])
  }
  return await cmd("XADD", arg)
}

module.exports = {
  initRedis,
  sendStream,
  getStream
}