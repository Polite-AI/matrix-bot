const languagePacks = require('./languagePacks.json');
const myURL = 'http://api.polite.ai';

module.exports = function makeMessageResponse(message, classification, language, key, eventid) {
    const pack = languagePacks[language || 'english'];
    const randIndex = Math.floor(Math.random() * pack.length);
    //const reportUrl = ' (challenge me at '+myURL+'/admin/'+key+')';
    const reportUrl = ' (challenge me at '+myURL+'/admin/'+key+'#'+encodeURIComponent(eventid)+')';
    return pack[randIndex]+reportUrl;
}
