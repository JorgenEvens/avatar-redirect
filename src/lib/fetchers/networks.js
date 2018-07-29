const { NETWORKS } = require('lib/env');

const availableNetworks = [
    'instagram',
    'twitter',
    'google',
    'facebook',
    'skype'
];

const networks = {};
module.exports = networks;

(NETWORKS || availableNetworks).forEach(network => {
    try {
        networks[network] = require('./' + network);
    } catch(err) {
        console.error(`Failed to load ${network} due to error: ${err.message}`, err);
    }
});

