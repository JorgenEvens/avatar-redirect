const fetch = require('lib/fetch');
const _get = require('lodash/get');

const twitterRegexp = /^https?:\/\/(www\.)?twitter\.com\/[^\/]+\/profile_image.*/;

async function followRedirect(username, { req }) {
    username = encodeURIComponent(username);
    const size = encodeURIComponent(req.query.size || 'original');

    let url = `https://twitter.com/${username}/profile_image?size=${size}`;

    while (url && twitterRegexp.test(url)) {
        const res = await fetch(url, {
            headers: {
                'user-agent': req.get('user-agent')
            },
            redirect: 'manual'
        });

        if (![302, 301].includes(res.status))
            return null;

        url = res.headers.get('location');
    }

    return url;
}

module.exports = [
    followRedirect
];
