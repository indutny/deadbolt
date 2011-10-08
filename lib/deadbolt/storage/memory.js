/*!
 * Deadbolt
 * Copyright(c) 2011 Fedor Indutny <fedor@indutny.com>
 * MIT Licensed
 */

//
// ### function Memory (options)
// #### @options {object} Storage options
// Memory storage constructor.
//
function Memory(options) {
  this.options = options;
  this.locks = {};
};
module.exports = Memory;

//
// ### function lock (id, callback)
// #### @id {string} Lock id.
// #### @callback {function} Continuation to respond to.
// Stores lock in storage.
//
Memory.prototype.lock = function(id, callback) {
  if (this.locks[id]) {
    process.nextTick(function() {
      callback(Error('Lock for: ' + id + ' is already set'));
    });
  } else {
    this.locks[id] = true;
    process.nextTick(function() {
      callback(null);
    });
  }
};

//
// ### function unlock (id, callback)
// #### @id {string} Lock id.
// #### @callback {function} Continuation to respond to.
// Removes lock from storage.
//
Memory.prototype.unlock = function(id, callback) {
  if (this.locks[id]) {
    delete this.locks[id];
  }
  process.nextTick(function() {
    callback(null);
  });
};
