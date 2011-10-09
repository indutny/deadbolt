/*!
 * Deadbolt
 * Copyright(c) 2011 Fedor Indutny <fedor@indutny.com>
 * MIT Licensed
 */

var deadbolt = require('../deadbolt');

exports.wrap = function (fn) {
  var lock = deadbolt.lock();

  lock.autorelease(fn);

  return function () {
    lock.release();
    return fn.apply(this, arguments);
  };
};
