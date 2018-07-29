const Cache = require('./cache');

module.exports =
class MemoryCache extends Cache {

    constructor() {
        super();

        this.type = 'Memory';

        this._cache = {};
        this._cleanup = this._cleanup.bind(this);
        this._interval = setInterval(this._cleanup, 300 * 1000);
    }

    _cleanup() {
        const now = Date.now();
        const cache = this._cache;

        for (const key in cache) {
            const item = cache[key];

            if (item.expires && item.expires < now)
                delete cache[key];
        }
    }

    async set(key, value, options = {}) {
        const { ttl } = options;

        const opts = {};

        if (typeof ttl === 'number')
            opts.expires = Date.now() + ttl;

        this._cache[key] = {
            value,
            ...opts
        };
    }

    async get(key) {
        const { value, expires } = this._cache[key] || {};

        if (expires && expires < Date.now())
            return;

        return value;
    }

    async del(key) {
        delete this._cache[key];
    }

    async has(key) {
        return (typeof this._cache[key] !== 'undefined');
    }

}
