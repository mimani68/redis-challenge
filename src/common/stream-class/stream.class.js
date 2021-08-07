let { sendStream, getStream } = require('../redis/redis')
let { log } = require('../logs')

function StreamHandler(){}

StreamHandler.prototype.GetStreams = async function(streamName) {
  let result = getStream(streamName)
    .then( o => {
      log(o)
      return o
    })
    .catch( e => {
      log(e)
      return e
    })
  return result
}

StreamHandler.prototype.SetStreams = async function(streamName, value) {
  let result = sendStream(streamName, value)
    .then( o => {
      log(o)
      return o
    })
    .catch( e => {
      log(e)
      return e
    })
  return result
}

module.exports = { StreamHandler }