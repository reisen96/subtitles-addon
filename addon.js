const {serveHTTP, addonBuilder} = require("stremio-addon-sdk");
const axios = require("axios");
const {LibreTranslate} = require("libretranslate");
const OpenSubtitles = require("opensubtitles-api");

const manifest = require("./manifest.json");

const builder = new addonBuilder(manifest);

testSub();


async function testSub() {

    const id = "tt16418896"
    console.log("Roee");

    // Fetch the subtitles from OpenSubtitles.com
    const openSubtitles = new OpenSubtitles({
        useragent: "UserAgent",
        ssl: true,
    });

    const subtitles = await openSubtitles.search({
        imdbid: id, // Assuming the ID passed is the IMDB ID
    });

    if (!subtitles || subtitles.length === 0) {
        return {subtitles: []}; // No subtitles found
    }

    const subtitle = subtitles[0];

    // Fetch the subtitle content
    const {data} = await axios.get(subtitle.url, {responseType: "text"});

    // Translate the subtitle using LibreTranslate
    const libreTranslate = new LibreTranslate({
        endpoint: "https://your-libretranslate-endpoint.com",
    });

    const translatedSubtitle = await libreTranslate.translate({
        q: data,
        source: "original-language-code",
        target: "translated-language-code",
    });

    // Return the translated subtitle in Stremio's expected format
    return {subtitles: [{lang: "translated-language-code", url: translatedSubtitle}]};
}






