const fetch = require('node-fetch');

module.exports = (url, options = {}) => {
    options = {
        ...options,
        headers: {
            'user-agent': 'Avatar Redirect Service',
            ...options.headers
        }
    };

    return fetch(url, options);
}
