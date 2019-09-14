const fetch = require('lib/fetch');
const cheerio = require('cheerio');

const profilePicRegexp = /"profile_pic_url_hd"\s*:\s*"([^"]+)"/i;

async function profileScrape(username) {
    username = encodeURIComponent(username);

    const res = await fetch(`https://www.instagram.com/${username}/`);
    const html = await res.text();
    const doc = cheerio.load(html);
    const scripts = doc('script').get();

    // Extract HD version from javascript source
    for (const script of scripts) {
        const text = doc(script).html();
        const picture = profilePicRegexp.exec(text);

        if (picture && picture[1])
            return picture[1];
    }

    if (doc('meta[property="og:type"]').attr('content') != 'profile')
        return null;

    return doc('meta[property="og:image"]').attr('content');
}

module.exports = [
    profileScrape
];
