const fetchAvatar = require('lib/fetcher');
const limitReferer = require('middleware/referer');

module.exports = [
    limitReferer,
    (req, res) => {
        const { network, user } = req.params;

        Promise.resolve()
            .then(() => fetchAvatar(network, user, { req }))
            .then(picture => {
                if (!picture || !picture.url) {
                    return res.status(404).end();
                }

                const  { url, expires } = picture;
                const ttl = expires - Date.now();

                res.set('cache-control', `public, max-age=${ttl}`);
                res.set('Expires', new Date(expires).toUTCString());

                return res.redirect(url);

            })
            .catch(err => {
                // eslint-disable-next-line no-console
                console.log({ err });
                res.set('X-Error', err.message);
                res.status(400);
                res.end();
            });
    }
];
