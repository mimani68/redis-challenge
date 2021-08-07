
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
  arrayToObject
}
