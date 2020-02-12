const fetch = require('lib/fetch');
const cheerio = require('cheerio');

async function profileScrape(username) {
    username = encodeURIComponent(username);

    const res = await fetch(`https://www.twitter.com/${username}/`);
    const html = await res.text();
    const doc = cheerio.load(html);

    const profilePicture = doc('a.profile-picture');
    const image = profilePicture.attr('data-resolved-url-large') ||
        profilePicture.attr('data-url') ||
        profilePicture.attr('href');

    if (!image || typeof image != 'string')
        return null;

    // Strip size parameter
    // Ex: https://pbs.twimg.com/profile_images/1184774364702617600/2DmGoqCz_400x400.jpg
    const original = image.replace(/_([^.\/]+)\.([a-z]+)$/i, '.$2');

    return original;
}

module.exports = [
    profileScrape
];
