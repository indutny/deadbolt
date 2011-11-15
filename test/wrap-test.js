var vows = require('vows'),
    assert = require('assert');

var deadbolt = require('../lib/deadbolt');

function doGc() {
  return setInterval(function () { gc(); }, 200);
};

vows.describe('deadbolt/wrap').addBatch({
  'Calling deadbolt.wrap for callback': {
    'that fires': {
      topic: function () {
        var callback = deadbolt.wrap(this.callback);
        this.int = gc();

        setTimeout(function () {
          callback(null);
        }, 1000);
      },
      'should not fire weak error': function (err, data) {
        assert.isNull(err);
      }
    }
  }
}).addBatch({
  'Calling deadbolt.wrap for callback': {
    'that is not firing': {
      topic: function () {
        var callback = deadbolt.wrap(this.callback);
        this.int = gc();
      },
      'should fire weak error': function (err, data) {
        assert.ok(err);
      }
    }
  }
}).export(module);
