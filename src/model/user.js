// const { hmsetAsync } = require("../common/redis/redis")

function User(...params) {
  this.REDIS_KEY = 'user-'
  this.name      = params[0]
  this.email     = params[1]
  this.password  = params[2]
}

User.prototype.save = async function() {
  let self = this
  const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
  })
  let isValid = schema.validate({
    name     : self.name,
    email    : self.email,
    password : self.password
  })
  if ( isValid ) {
    let label = this.REDIS_KEY
    // let result = await hmsetAsync(label, {
    //   user     : self.name,
    //   email    : self.email,
    //   password : self.password
    // })
    return true
  } else {
    return false
  }
}

module.exports = { User }