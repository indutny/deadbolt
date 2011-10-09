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

  // Initiate storage
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

  // Remove lock from storage
  this.release();

  // Invoke .autorelease() callback
  var err = Error('Lock became weak: ' + (this.info || 'without info'));
  this.weakCallback(err);
};

//
// ### function lock (id, info, callback)
// #### @id {string} [optional] Lock identificator
// #### @info {string} [optional] Optional info, that'll be shown on autorelease
// #### @callback {function} Continuation to respond to
// Initiate lock
//
Deadbolt.prototype.lock = function lock(id, info, callback) {
  // .lock(function () {})
  if (typeof id === 'function') {
    callback = id;
    id = null;
    info = null;
  }
  // .lock('id', function () {})
  else if (typeof info === 'function') {
    callback = info;
    info = null;
  }

  var storage = this.storage,
      // Create reference for which .MakeWeak will be called
      ref = {
        id: id,
        locked: true,
        info: info,
        weakCallback: function () {},
        // Allow external script to release lock manually
        release: function (callback) {
          this.locked = false;
          unlock(callback || function () {});
        },
        autorelease: function (fn) {
          weak(this, onWeak);
          this.weakCallback = fn;
        }
      };

  // Callback could be optional too
  callback || (callback = function () {});

  // Store lock in storage and then lock
  if (id !== null) {
    storage.lock(id, function (err) {
      if (err) return callback(err);
      callback(null, ref);
    });
  }
  // Do not store lock
  else {
    process.nextTick(function () {
      callback(null, ref);
    });
  }

  function unlock(callback) {
    if (id !== null) {
      storage.unlock(id, callback);
    }
    else {
      callback(null);
    }
  };

  // Allow external script to set autorelease callback
  return ref;
};
