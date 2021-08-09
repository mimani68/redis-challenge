const { promisify } = require("util");
const redis = require("redis");
const redisConfig = require('../../config/redis')

const client = redis.createClient(redisConfig);
const hmsetAsync = promisify(client.hmset).bind(client);

module.exports = { 
  redisClient: client,
  hmsetAsync
} 