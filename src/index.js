const express = require('express');

const app = express();
const { PORT } = require('lib/env');

app.set('x-powered-by', false);

app.get('/:network/:user', ...require('controllers/picture'));

app.all('*', (req, res) => {
    res.status(400).end();
});

app.listen(PORT);

console.log(`Application listening on ${PORT}`);
