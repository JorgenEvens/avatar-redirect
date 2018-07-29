const express = require('express');
const fetchAvatar = require('lib/fetchers');

const app = express();
const { PORT = 5000 } = process.env;

app.set('x-powered-by', false);

app.get('/:network/:user', (req, res) => {
    const { network, user } = req.params;

    fetchAvatar(network, user, { req })
        .then(picture => {
            if (!picture || !picture.url) {
                return res.status(404).end();
            }

            const  { url, expires } = picture;
            const ttl = expires - Date.now();

            res.set('cache-control', 'public, max-age=${ttl}');
            res.set('Expires', new Date(expires).toUTCString());

            return res.redirect(url);

        })
        .catch(err => {
            console.log({ err });
            res.set('X-Error', err.message);
            res.status(400);
            res.end();
        });
});

app.all('*', (req, res) => {
    res.status(400).end();
});

app.listen(PORT);

console.log(`Application listening on ${PORT}`);
