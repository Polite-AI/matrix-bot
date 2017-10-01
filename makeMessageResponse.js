const languagePacks = require('./languagePacks.json');
const myURL = 'http://api.polite.ai';

module.exports = function makeMessageResponse(message, classification, language, key, eventid) {
    const pack = languagePacks[language || 'english'];
    const randIndex = Math.floor(Math.random() * pack.length);
    //const reportUrl = ' (challenge me at '+myURL+'/admin/'+key+')';
    var reportUrl = ' (challenge me at '+myURL+'/admin/'+key;
    if (eventid != null)
        reportURL += '#'+encodeURIComponent(eventid);
    reportUrl += ')';
    return ((classification != null)?pack[randIndex]:message)+reportUrl;
}
