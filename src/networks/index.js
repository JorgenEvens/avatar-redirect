const { NETWORKS } = require('lib/env');

const availableNetworks = [
    'instagram',
    'twitter',
    'google',
    'facebook',
    'skype',
    'vkontakte'
];

const networks = {};
module.exports = networks;

(NETWORKS || availableNetworks).forEach(network => {
    try {
        networks[network] = require('./' + network);
    } catch(err) {
        // eslint-disable-next-line no-console
        console.error(`Failed to load ${network} due to error: ${err.message}`, err);
    }
});

