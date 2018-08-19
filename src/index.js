const morgan = require('morgan');
const express = require('express');

const app = express();
const { PORT, LOG_FORMAT } = require('lib/env');

app.set('x-powered-by', false);

if (LOG_FORMAT !== 'none')
    app.use(morgan(LOG_FORMAT));

app.get('/:network/:user', ...require('controllers/picture'));

app.all('*', (req, res) => {
    res.status(400).end();
});

app.listen(PORT);

// eslint-disable-next-line no-console
console.log(`Application listening on ${PORT}`);
