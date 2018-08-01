const fetch = require('lib/fetch');
const _get = require('lodash/get');

async function picasaweb(username) {
    username = encodeURIComponent(username);

    const res = await fetch(`https://picasaweb.google.com/data/entry/api/user/${username}?alt=json`);

    if (!res.ok)
        return null;

    const body = await res.json();

    return _get(body, 'entry.gphoto$thumbnail.$t');
}

module.exports = [
    picasaweb
];
