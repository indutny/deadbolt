/*!
 * Deadbolt
 * Copyright(c) 2011 Fedor Indutny <fedor@indutny.com>
 * MIT Licensed
 */

var deadbolt = exports;

// Init storages
deadbolt.storages = {
  memory: require('./deadbolt/storage/memory'),
  redis: require('./deadbolt/storage/redis')
};

// Native bindings
deadbolt.weak = require('./deadbolt/weak').weak;

// Export main function
deadbolt.create = require('./deadbolt/core').create;

// Export instantiated lock function
deadbolt.lock = require('./deadbolt/core').lock;

// Export wrap
deadbolt.wrap = require('./deadbolt/wrap').wrap;
