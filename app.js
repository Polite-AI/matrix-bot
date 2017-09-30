const log = require('./logger.js');
const request = require('request-promise-native');

module.exports = function (message, room, event, client) {
    log.log(`Recieved message [${message}]`);
    return request.post({
            method: 'POST',
            uri: 'http://api.polite.ai/api/1.0/classify',
            body: {
                text: message
            },
            json: true
        })
        .then(res => {
            log.log(`Got following results for [${message}]: `, res.results);
            const positiveResults = Object.keys(res.results).filter(key => Number(res.results[key]));
            if (positiveResults.length) {
                const scoreText = Object.keys(res.results).map(key => `${key}=${res.results[key]}`).join(', ');
                client.sendTextMessage(room.roomId, `${event.getSender()}: Your message was detected as the following: ${scoreText}`);
            }
        })
        .catch(err => {
            log.warn(`Failed to get data from api (${message})`, err);
        });
};