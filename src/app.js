var async = require('async');
var redis = require('redis');

function App(options) {
  this.redisClient = redis.createClient(options);
}

App.prototype.defineVariables = function () {
  this.STREAMS_KEY = "weather_sensor:wind";
  this.APPLICATION_ID = "iot_application:node_1";
  this.CONSUMER_ID = "consumer:1"
  return this
}

App.prototype.defineGroup = function () {
  this.redisClient.xgroup("CREATE", this.STREAMS_KEY, this.APPLICATION_ID, '$', function (err) {
    if (err) {
      if (err.code == 'BUSYGROUP') {
        console.log(`Group ${this.APPLICATION_ID} already exists`);
      } else {
        console.log(err);
        process.exit();
      }
    }
  });
  return this
}

App.prototype.launch = function () {
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
          messages.forEach(function (message) {
            // convert the message into a JSON Object
            var id = message[0];
            var values = message[1];
            var msgObject = {
              id: id
            };
            for (var i = 0; i < values.length; i = i + 2) {
              msgObject[values[i]] = values[i + 1];
            }
            console.log("Message: " + JSON.stringify(msgObject));
          });

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

module.exports = {
  App
}