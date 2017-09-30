const pgp = require('pg-promise')();
const log = require('./logger.js');
const config = require('./config.js');
const request = require('request-promise-native');
const makeMessageResponse = require('./makeMessageResponse.js');

const db = pgp(config.postgres);

module.exports = function (message, room, event, client, language) {
    log.log(`Recieved message [${message}]`);
    return request.post({
            method: 'POST',
            uri: `http://api.polite.ai/api/${config.api.version}/classify`,
            body: {
                text: message
            },
            json: true
        })
        .then(res => {
            log.log(`Got following results for [${message}]: `, res.results);
            const positiveResults = Object.keys(res.results).filter(key => Number(res.results[key]));
            if (positiveResults.length) {
                const messageResponse = makeMessageResponse(message, res.results, language);
                client.sendTextMessage(room.roomId, `${event.getSender()}: ${messageResponse}`);

                return db.none('INSERT INTO messages(message, classifier, derived, room_provider, room_id, event_id, time) VALUES(${message}, ${classifier}, ${derived}, ${room_provider}, ${room_id}, ${event_id}, ${time})', {
                    message: message,
                    classifier: config.api.version,
                    derived: JSON.stringify(res.results),
                    room_provider: 'matrix',
                    room_id: room.roomId,
                    event_id: event.event.event_id,
                    time: event._date
                });
            }
        })
        .catch(err => {
            log.warn(`Failed to get data from api (${message})`, err);
        });
};