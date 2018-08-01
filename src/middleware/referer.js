const { LIMIT_REFERER } = require('../lib/env');

const regex = LIMIT_REFERER && new RegExp(LIMIT_REFERER, 'i');

module.exports = function(req, res, next) {
    if (!regex)
        return next();

    const referer = req.get('referer');

    if (!referer || !regex.test(referer))
        return res.status(401).end();

    return next();
};
