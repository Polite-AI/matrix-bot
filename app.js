const pgp = require('pg-promise')();
const log = require('./logger.js');
const config = require('./config.js');
const request = require('request-promise-native');
const makeMessageResponse = require('./makeMessageResponse.js');
const crypto = require('crypto');


const db = pgp(config.postgres);
const salt = config.global.secretsalt;

module.exports = function (message, room, event, client, language) {

    log.log(`Recieved message [${message}]`);
    user_id = event.getSender();
    // Don't store or act on our own messages
    for (bot in config.bots)
        if(config.bots[bot].userId == user_id)
            return (Promise.resolve(true));
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

            // Make a hash
            const room_key = crypto.createHash('sha256',salt)
                                .update('matrix'+room.roomId)
                                .digest('base64');


            const positiveResults = Object.keys(res.results).filter(key => Number(res.results[key]));
            // If we got a positive result then bitch in the room
            if (positiveResults.length) {
                const messageResponse = makeMessageResponse(message, res.results, language, room_key, event.event.event_id);
                client.sendTextMessage(room.roomId, `${event.getSender()}: ${messageResponse}`);
            }
            // Always store the message in the DB
            return db.none('INSERT INTO messages(message, classifier, derived, room_provider, room_id, room_key, user_id, event_id, time) VALUES(${message}, ${classifier}, ${derived}, ${room_provider}, ${room_id}, ${room_key}, ${user_id}, ${event_id}, ${time})', {
                message: message,
                classifier: config.api.version,
                derived: JSON.stringify(res.results),
                room_provider: 'matrix',
                room_id: room.roomId,
                room_key: room_key,
                user_id: user_id,
                event_id: event.event.event_id,
                time: event._date
            });


        })
        .catch(err => {
            log.warn(`Failed to get data from api (${message})`, err);
        });
};
