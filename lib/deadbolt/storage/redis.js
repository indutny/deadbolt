/*!
 * Deadbolt
 * Copyright(c) 2011 Fedor Indutny <fedor@indutny.com>
 * MIT Licensed
 */

var redis = require('redis');

//
// ### function Redis (options)
// #### @options {object} Storage options
// Redis storage constructor.
// Possible options:
//   * @prefix {string} all used keys in redis will be prefixed with that value
//   * @ttl {number} argument to redis' EXPIRE command
//   * @port {number} port of redis server
//   * @host {string} hostname of redis server
//   * @password {string} server's password
//
function Redis(options) {
  this.options = options;

  this.prefix = this.options.prefix || 'deadbolt';
  this.ttl = this.options.ttl || 3;

  this.client = redis.createClient(options.port, options.host);

  if (options.auth) this.client.auth(options.password);
};
module.exports = Redis;

//
// ### function _key (id)
// #### @id {string} Lock id.
// (internal) Returns prefixed key for lock's id
//
Redis.prototype._key = function (id) {
  return this.prefix + '::' + id;
};

//
// ### function lock (id, callback)
// #### @id {string} Lock id.
// #### @callback {function} Continuation to respond to.
// Stores lock in storage.
//
Redis.prototype.lock = function (id, callback) {
  var key = this._key(id);

  this.client.setnx(key, 'lock', function(err, result) {
    if (result === 0) err = true;
    callback(err && Error('Lock for: ' + id + ' is already set'));

    // node_redis is storing callbacks somewhere inside it
    // we need to remove reference to allow GC to be called for `ref` in core
    callback = null;
  });
  this.client.expire(key, this.ttl);
};

//
// ### function unlock (id, callback)
// #### @id {string} Lock id.
// #### @callback {function} Continuation to respond to.
// Removes lock from storage.
//
Redis.prototype.unlock = function (id, callback) {
  var key = this._key(id);

  this.client.del(key, function(err, result) {
    if (result === 0) err = true;
    callback(err && Error('Failed to release lock for: ' + id));

    callback = null;
  });
};
