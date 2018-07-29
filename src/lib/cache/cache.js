const _isNil = require('lodash/isNil');

module.exports =
class Cache {

    async set(key, value, options = {}) {}

    async get(key) { return null; }

    async del(key) {}

    async has(key) {
        return !_isNil(await this.get(key));
    }

}
