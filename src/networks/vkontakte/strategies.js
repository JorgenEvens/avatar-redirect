const _get = require('lodash/get');

const fetch = require('lib/fetch');
const { VKONTAKTE_KEY, VKONTAKTE_API_VERSION } = require('lib/env');

const PHOTO_FIELDS = encodeURIComponent([
    'photo_50',
    'photo_100',
    'photo_200',
    'photo_max'
].join(','));

const API_QUERY_PARAMS = `fields=${PHOTO_FIELDS}&access_token=${VKONTAKTE_KEY}&v=${VKONTAKTE_API_VERSION}`;

async function vkontakteApi(userId, { req }) {
    const { size = 100 } = req.query || {};
    userId = encodeURIComponent(userId);

    const url = `https://api.vk.com/method/users.get?${API_QUERY_PARAMS}&user_id=${userId}`;
    const res = await fetch(url);

    if (!res.ok)
        return null;

    const body = await res.json();
    const response = _get(body, 'response[0]');

    if (!response)
        return null;

    if (size <= 50)
        return response.photo_50;

    if (size <= 100)
        return response.photo_100;

    if (size <= 200)
        return response.photo_200;

    return response.photo_max;
}

module.exports = [
    vkontakteApi
];
