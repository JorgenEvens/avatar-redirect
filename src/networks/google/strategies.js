const fetch = require('lib/fetch');
const _get = require('lodash/get');
const { GOOGLE_API_KEY } = require('lib/env');

const key = encodeURIComponent(GOOGLE_API_KEY || '');

async function peopleApi(username, { req }) {
    if (!GOOGLE_API_KEY)
        return null;

    const { size = 100 } = req.query || {};

    username = encodeURIComponent(username);

    const res = await fetch(`https://people.googleapis.com/v1/people/${username}?personFields=photos&key=${key}`);

    if (!res.ok)
        return null;

    const body = await res.json();
    const url = _get(body, 'photos.0.url');

    if (!url)
        return null;

    return url.replace(/=s\d+/, `=s${size}`);
}

module.exports = [
    peopleApi
];
