var deadbolt = require('../deadbolt'),
    weak = require('weak');

var core = exports;

function Deadbolt(type, options) {
  type || (type = 'memory');
  options || (options = {});

  if (!deadbolt.storages[type]) throw Error('Unknown storage type: ' + type);

  this.options = options;
  this.storage = new deadbolt.storages[type](options);
};
core.Deadbolt = Deadbolt;

core.create = function create(options) {
  return new Deadbolt(options);
};

function onWeak() {
  if (!this.locked) return;
  this.unlock();

  this.report(Error('Lock became weak.'));
};

Deadbolt.prototype.lock = function lock(id, callback) {
  var storage = this.storage,
      report;

  storage.lock(id, function (err) {
    if (err) return callback(err);

    var ref = { id: id, locked: true, report: report || function() {} };

    weak(ref, onWeak);

    ref.unlock = function(callback) {
      ref.locked = false;
      storage.unlock(id, callback || function () {});
    };

    callback(null, ref);
  });

  return {
    report: function(fn) {
      report = fn;
    }
  };
};
