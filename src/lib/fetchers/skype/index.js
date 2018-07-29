const fetch = require('lib/fetch');

async function option1(skypeId) {
    skypeId = encodeURIComponent(skypeId);

    const url = `https://api.skype.com/users/${skypeId}/profile/avatar`;
    const res = await fetch(url);

    if (!res.ok)
        return null;

    return url;
}

module.exports = [
    option1
];
