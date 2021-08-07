var async = require('async');
var redis = require('redis');

function StreamHandler(options) {
  this.redisClient = redis.createClient(options);
}

StreamHandler.prototype.defineVariables = function (stream_key) {
  this.STREAMS_KEY    = stream_key || "app:data";
  this.APPLICATION_ID = "app:node:1";
  this.CONSUMER_ID    = "consumer:1"
  return this
}

StreamHandler.prototype.defineGroup = function () {
  let self = this
  this.redisClient.xgroup("CREATE", self.STREAMS_KEY, self.APPLICATION_ID, '$', function (err) {
    if (err) {
      if (err.code == 'BUSYGROUP') {
        console.log(`Group ${self.APPLICATION_ID} already exists`);
      } else {
        console.log(err);
        process.exit();
      }
    }
  });
  return this
}

StreamHandler.prototype.sendMessage = function (steamAddress, value) {
  if ( !steamAddress ) {
    steamAddress = this.STREAMS_KEY
  }
  this.redisClient.xadd(steamAddress, '*', 
    'direction', 'right',  
    'sensor_ts', '154', 
    'loop_info', 1,  
    function (err) { 
      if (err) { 
        console.log(err)
      };
    });
}

StreamHandler.prototype.createStream = function (streamObject) {
  for ( let key in streamObject ) {
    this.redisClient.xadd(streamObject[key], '*', 'a', '1')
  }
}

StreamHandler.prototype.listen = function (cb) {
  let self = this
  async.forever(
    function (next) {
      self.redisClient.xreadgroup('GROUP', self.APPLICATION_ID, self.CONSUMER_ID, 'BLOCK', 500, 'STREAMS', self.STREAMS_KEY, '>', function (err, stream) {
        if (err) {
          console.error(err);
          next(err);
        }

        if (stream) {
          var messages = stream[0][1];
          // print all messages
          let e = arrayToObject( messages )
          cb(e)

        } else {
          console.log("Waiting");
        }
        next();
      });
    },
    function (err) {
      console.log(" ERROR " + err);
      process.exit()
    }
  );
}

function arrayToObject (messages) {
  var msgObject = {}
  messages.forEach(function (message) {
    // convert the message into a JSON Object
    msgObject.id = message[0]
    var values = message[1];
    for (var i = 0; i < values.length; i = i + 2) {
      msgObject[values[i]] = values[i + 1];
    }
    console.log("Message: " + JSON.stringify(msgObject));
  });
  return msgObject
}

module.exports = {
  StreamHandler
}