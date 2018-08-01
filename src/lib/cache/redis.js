const Cache = require('./cache');
const Redis = require('ioredis');

module.exports =
class RedisCache extends Cache {

    constructor(url) {
        super();

        this.type = 'Redis';
        this._client = new Redis(url);
    }

    async set(key, value, options = {}) {
        const { ttl } = options;

        const args = [ key, value ];

        if (typeof ttl === 'number')
            args.push('PX', options.ttl);

        return this._client.set(...args);
    }

    async get(key) {
        return this._client.get(key);
    }

    async del(key) {
        return this._client.del(key);
    }

    async has(key) {
        return this._client.exists(key) > 0;
    }

};
