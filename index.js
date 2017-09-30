const log = require('./logger.js');
const config = require('./config.js');
log.info(`Starting PoliteAI Matrix Bot using [${config.matrix.baseUrl}]`);

global.Olm = require('olm');
const sdk = require('matrix-js-sdk');

const handleMessage = require('./app.js'); // Our 'routes'

const client = sdk.createClient({ // Create a client with data from config.js
    baseUrl: config.matrix.baseUrl,
    userId: config.matrix.userId,
    accessToken: config.matrix.accessToken
});

client.startClient(); // Because apparently this is necessary?

client.on("Room.timeline", async function (event, room, toStartOfTimeline) { // Listen to Room Timeline events
    if (toStartOfTimeline) {
        return; // don't print paginated results
    }
    if (event.getType() !== "m.room.message") {
        return; // only print messages
    }
    if (event.getSender() === config.matrix.userId) {
        return;
    }

    const messageBody = event.getContent().body;

    await handleMessage(messageBody, room, event, client);
    log.log("(%s) %s :: %s", room.name, event.getSender(), messageBody); //Log all messages in room
});

client.on("RoomMember.membership", function (event, member) {
    if (member.membership === "invite" && member.userId === config.matrix.userId) {
        client.joinRoom(member.roomId).done(function () {
            log.log("Auto-joined %s", member.roomId);
            client.sendTextMessage(member.roomId, `Polite.AI bot has entered the building...`);
        });
    }
});