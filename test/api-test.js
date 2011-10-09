var vows = require('vows'),
    assert = require('assert');

var deadbolt = require('../lib/deadbolt');

var d;

function doGc() {
  return setInterval(function () { gc(); }, 200);
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
      'with .release method': function(err, o) {
        assert.isNull(err);
        assert.include(o, 'release');
      },
      'and if calling it\'s .release(callback) method': {
        topic: function(o) {
          o.release(this.callback);
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
      'with .release method': function(err, o) {
        assert.isNull(err);
        assert.include(o, 'release');
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
  'Calling d.lock(id, nop).autorelease(callback)': {
    topic: function() {
      var callback = this.callback;
      d.lock('c', function() {}).autorelease(function(err) {
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
