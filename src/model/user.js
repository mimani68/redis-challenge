const { hmsetAsync } = require("../common/redis/redis")
const Joi = require('joi')
const uuid = require('uuid')

function User(...params) {
  this.REDIS_KEY = 'user-'
  this.name      = params[0]
  this.email     = params[1]
  this.password  = params[2]
}

User.prototype.save = async function() {
  let self = this
  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
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
    let id = uuid.v4()
    let result = await hmsetAsync(label + id, {
      id       : id,
      user     : self.name,
      email    : self.email,
      password : self.password
    })
    if ( result ) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

module.exports = { User }