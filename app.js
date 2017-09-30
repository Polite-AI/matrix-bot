const log = require('./logger.js');

module.exports = function (message, room, event, client) {
    log.log(`Recieved message [${message}]`);
    const isAngry = ~message.toLowerCase().indexOf('angry');

    if (isAngry) {
        log.log(`Found an 'angry' message: [${message}]`);
        return new Promise((resolve, reject) => {
            client.sendTextMessage(room.roomId, `${event.getSender()}: Don't be angry... We're all friends here...`);
            resolve();
        });
    }

    return Promise.resolve();
};