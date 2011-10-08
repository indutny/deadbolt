var vows = require('vows'),
    assert = require('assert');

var deadbolt = require('../lib/deadbolt');

var d;

function doGc() {
  process.nextTick(gc);

  return setInterval(function () {}, 60000);
};

vows.describe('deadbolt/api').addBatch({
  'Calling deadbolt.create()': {
    topic: function () {
      d = deadbolt.create();
      return null;
    },
    'should create deadbolt instance with memory storage': function () {}
  }
}).addBatch({
  'Calling d.lock(id, callback)': {
    topic: function() {
      d.lock('a', this.callback);
    },
    'should return object': {
      'with .unlock method': function(err, o) {
        assert.isNull(err);
        assert.include(o, 'unlock');
      },
      'and if calling it\'s .unlock(callback) method': {
        topic: function(o) {
          o.unlock(this.callback);
        },
        'should call callback': function(err, data) {
          assert.isNull(err);
        },
        'and finally calling d.lock again': {
          topic: function() {
            d.lock('a', this.callback);
          },
          'should be successful': function (err, data) {
            assert.isNull(err);
          }
        }
      }
    }
  }
}).addBatch({
  'Calling d.lock(id, callback)': {
    topic: function() {
      d.lock('b', this.callback);
    },
    'should return object': {
      'with .unlock method': function(err, o) {
        assert.isNull(err);
        assert.include(o, 'unlock');
      },
      'and calling d.lock(id, callback) twice': {
        topic: function() {
          d.lock('b', this.callback);
        },
        'should return error': function(err, data) {
          assert.ok(err);
        }
      }
    }
  }
}).addBatch({
  'Calling d.lock(id, nop).report(callback)': {
    topic: function() {
      var callback = this.callback;
      d.lock('c', function() {}).report(function(err) {
        callback(null, err);
      });
      this.int = doGc();
    },
    'should emit reporter callback with error': function(err) {
      clearInterval(this.int);
      assert.ok(err);
    },
    'and creating same lock again': {
      topic: function () {
        d.lock('c', this.callback);
      },
      'should be without errors': function () {
      }
    }
  }
}).export(module);
