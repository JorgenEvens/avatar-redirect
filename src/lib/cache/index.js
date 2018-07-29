const Cache = require('./cache');
const Redis = require('./redis');
const Memcache = require('./memcache');
const Memory = require('./memory');

const { MEMCACHE_URL, REDIS_URL } = require('lib/env');

module.exports = {
    Cache,
    Redis,
    Memcache,
    Memory
};

if (MEMCACHE_URL)
    module.exports.client = new Memcache(MEMCACHE_URL);
else if (REDIS_URL)
    module.exports.client = new Redis(REDIS_URL);
else
    module.exports.client = new Memory();
