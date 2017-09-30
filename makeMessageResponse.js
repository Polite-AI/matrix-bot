const languagePacks = require('./languagePacks.json');

module.exports = function makeMessageResponse(message, classification, language) {
    const pack = languagePacks[language || 'english'];
    const randIndex = Math.floor(Math.random() * pack.length);
    return pack[randIndex];
}