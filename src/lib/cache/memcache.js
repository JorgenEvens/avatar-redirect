const Cache = require('./cache');
const { Client } = require('memjs');

module.exports =
class Memcache extends Cache {

    constructor(connectionString) {
        super();

        this.type = 'Memcache';

        this._client = Client.create(connectionString);
    }

    async set(key, value, options = {}) {
        const { ttl } = options;

        const opts = {};

        if (typeof ttl === 'number')
            opts.expires = Math.ceil(ttl / 1000);

        value = JSON.stringify(value);

        return this._client.set(key, value, opts);
    }

    async get(key) {
        const response = await this._client.get(key);

        let { value } = response;

        if (!value || value.length < 1)
            return null;

        return JSON.parse(value.toString('utf8'));
    }

    async del(key) {
        return this._client.delete(key);
    }
}
