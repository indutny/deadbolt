var deadbolt = exports;

deadbolt.storages = {
  memory: require('./deadbolt/storage/memory')
};

deadbolt.weak = require('./deadbolt/weak').weak;

deadbolt.create = require('./deadbolt/core').create;
