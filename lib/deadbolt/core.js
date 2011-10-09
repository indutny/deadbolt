/*!
 * Deadbolt
 * Copyright(c) 2011 Fedor Indutny <fedor@indutny.com>
 * MIT Licensed
 */

var deadbolt = require('../deadbolt'),
    weak = deadbolt.weak;

var core = exports;

//
// ### function Deadbolt (type, options)
// #### @type {string} Storage type (only memory is available for now).
// #### @options {object} Storage options.
// Deadbolt's constructor
//
function Deadbolt(type, options) {
  type || (type = 'memory');
  options || (options = {});

  if (!deadbolt.storages[type]) throw Error('Unknown storage type: ' + type);

  this.options = options;
  this.storage = new deadbolt.storages[type](options);
};
core.Deadbolt = Deadbolt;

//
// ### function create (type, options)
// #### @type {string} Storage type (only memory is available for now).
// #### @options {object} Storage options.
// Creates new instance of Deadbolt
//
core.create = function create(type, options) {
  return new Deadbolt(type, options);
};

//
// ### function onWeak ()
// `MakeWeak` callback
//
function onWeak() {
  if (!this.locked) return;
  this.release();

  this.autorelease(Error('Lock became weak: ' + (this.info || 'without info')));
};

//
// ### function lock (id, info, callback)
Deadbolt.prototype.lock = function lock(id, info, callback) {
  var storage = this.storage,
      report,
      // Create reference for which .MakeWeak will be called
      ref = { id: id, locked: true, info: info, autorelease: function() {} };

  // If called w/o info
  if (typeof info === 'function') {
    callback = info;
    info = null;
  }

  // If called w/o id - lock immediately, skip storage
  if (typeof id === 'function') {
    callback = callback || id;
    lock();
  }
  // Store lock in storage and then lock
  else {
    storage.lock(id, function (err) {
      if (err) return callback(err);
      lock();
    });
  }

  function lock() {

    // Allow external script to release lock manually
    ref.release = function(callback) {
      ref.locked = false;
      storage.unlock(id, callback || function () {});
    };

    callback(null, ref);
  };

  return {
    // Allow external script to set report function
    autorelease: function(fn) {
      weak(ref, onWeak);
      ref.autorelease = fn;
    }
  };
};
