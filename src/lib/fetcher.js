const _pick = require('lodash/pick');
const objectHash = require('object-hash');

const networks = require('networks');
const { TTL_PROFILE_PICTURE } = require('lib/env');
const { client: cache, Memory } = require('lib/cache');

const cacheModifiers = [ 'req.query.size' ];

// Memory cache
const memory = new Memory();

async function addCache(key, url) {
    const opts = { ttl: TTL_PROFILE_PICTURE };
    const value = {
        url,
        expires: Date.now() + TTL_PROFILE_PICTURE
    };

    await Promise.all([
        memory.set(key, value, opts),
        cache.set(key, value, opts)
    ]);

    return value;
}

module.exports = async function fetch(network, username, opts = {}) {
    const fetchers = networks[network];
    const strategies = fetchers.strategies;

    const hash = objectHash(_pick(opts, cacheModifiers));
    const cacheKey = `img.${network}.${username}.${hash}`;

    if (!Array.isArray(strategies))
        throw new Error(`Network ${network} not supported`);

    async function next(idx) {
        const fetcher = strategies[idx];

        if (typeof fetcher !== 'function')
            return null;

        try {
            const url = await fetcher(username, opts);

            if (url)
                return addCache(cacheKey, url);
        } catch(err) {
            console.log({ err }, `Fetch for ${network} failed`);
            /* on error continue to next */
        }

        return next(idx + 1);
    }

    if (await memory.has(cacheKey))
        return memory.get(cacheKey);

    if (await cache.has(cacheKey)) {
        const response = await cache.get(cacheKey);

        // Re-populate memory cache
        await memory.set(cacheKey, response, response.expires - Date.now());

        return response;
    }

    return next(0);
}
