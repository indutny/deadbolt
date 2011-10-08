/*!
 * Deadbolt
 * Copyright(c) 2011 Fedor Indutny <fedor@indutny.com>
 * MIT Licensed
 */

module.exports = Memory;
function Memory(options) {
  this.options = options;
  this.locks = {};
};

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

Memory.prototype.unlock = function(id, callback) {
  if (this.locks[id]) {
    delete this.locks[id];
  }
  process.nextTick(function() {
    callback(null);
  });
};
