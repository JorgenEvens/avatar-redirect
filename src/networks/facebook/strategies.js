const fetch = require('lib/fetch');

async function facebookGraph(userId, { req }) {
    userId = encodeURIComponent(userId);
    const size = encodeURIComponent(req.query.size || 100);

    const url = `https://graph.facebook.com/${userId}/picture?width=${size}&height=${size}`;;
    const res = await fetch(url);

    if (!res.ok)
        return null;

    return url;
}

module.exports = [
    facebookGraph
];
