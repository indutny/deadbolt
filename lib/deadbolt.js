var deadbolt = exports;

deadbolt.storages = {
  memory: require('./deadbolt/storage/memory')
};

deadbolt.create = require('./deadbolt/core').create;
