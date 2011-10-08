var deadbolt = require('../deadbolt'),
    weak = deadbolt.weak;

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

  this.report(Error('Lock became weak: ' + (this.info || 'without info')));
};

Deadbolt.prototype.lock = function lock(id, info, callback) {
  var storage = this.storage,
      report;

  // Info is optional
  if (typeof callback === 'undefined') {
    callback = info;
    info = null;
  }

  storage.lock(id, function (err) {
    if (err) return callback(err);

    report || (report = function () {});
    var ref = { id: id, locked: true, report: report, info: info };

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
