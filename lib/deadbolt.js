/*!
 * Deadbolt
 * Copyright(c) 2011 Fedor Indutny <fedor@indutny.com>
 * MIT Licensed
 */

var deadbolt = exports;

// Init storages
deadbolt.storages = {
  memory: require('./deadbolt/storage/memory')
};

// Native bindings
deadbolt.weak = require('./deadbolt/weak').weak;

// Export main function
deadbolt.create = require('./deadbolt/core').create;

// Export bounded instance method
var instance = deadbolt.create();
deadbolt.lock = instance.lock.bind(instance);
