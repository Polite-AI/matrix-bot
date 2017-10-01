const log = require('./logger.js');
const config = require('./config.js');
log.info(`Creating ${config.bots.length} bots`);

global.Olm = require('olm');
const sdk = require('matrix-js-sdk');
const fs = require('fs');

const handleMessage = require('./app.js'); // Our 'routes'

config.bots.forEach(botConfig => {
    log.info(`Starting PoliteAI Matrix Bot using [${botConfig.userId}]`);

    let messageLastReceived = 0;

    try {
        messageLastReceived = Number(fs.readFileSync('./message_received_dtg', 'utf8'));
    } catch (err) {
        const now = Date.now();
        fs.writeFileSync('./message_received_dtg', now, 'utf8');
        messageLastReceived = now;
    }

    if (isNaN(messageLastReceived)) {
        messageLastReceived = Date.now();
    }


    const client = sdk.createClient({ // Create a client with data from config.js
        baseUrl: botConfig.baseUrl,
        userId: botConfig.userId,
        accessToken: botConfig.accessToken
    });

    client.startClient(); // Because apparently this is necessary?

    client.on("Room.timeline", async function (event, room, toStartOfTimeline) { // Listen to Room Timeline events
        if (toStartOfTimeline) {
            return; // don't print paginated results
        }
        if (event.getType() !== "m.room.message") {
            return; // only print messages
        }
        if (event.getSender() === botConfig.userId) {
            return;
        }
        if (event._date < messageLastReceived) { // Probably already processed
            return;
        }

        const now = Date.now();
        fs.writeFile(`./message_received_dtg_${botConfig.userId.replace(/[^a-zA-Z]/g, '')}`, now, 'utf8', () => {});
        messageLastReceived = now;

        const messageBody = event.getContent().body;

        handleMessage(messageBody, room, event, client, botConfig.language);
        log.log(`[${botConfig.userId}] ${room.name} ${event.getSender()} ${messageBody}`); //Log all messages in room
    });

    client.on("RoomMember.membership", function (event, member) {
        if (member.membership === "invite" && member.userId === botConfig.userId) {
            client.joinRoom(member.roomId).done(function () {
                log.log("Auto-joined %s", member.roomId);
                const room_key = require('crypto').createHash('sha256',salt)
                                    .update('matrix'+room.roomId)
                                    .digest('base64');

                //client.sendTextMessage(member.roomId, makeMessageResponse('http://polite.ai is Bot is in the room ', null, 'english', room_key, null));
            });
        }
    });

});

const bodyParser = require('body-parser');
const express = require('express');
const apiServer = express();

const pgp = require('pg-promise')();
const db = pgp(config.postgres);

apiServer.use(express.static('./client'));
apiServer.use(bodyParser.json());

apiServer.get('/admin/:roomKey', function(req, res){
    fs.createReadStream('./client/index.html').pipe(res);
});

apiServer.get('/getMessages/:roomKey', function(req, res){
    const roomKey = req.params.roomKey;

    db.query(`SELECT * from messages WHERE room_key='${roomKey}'`)
        .then(data => {
            res.send(data);
        });
});

apiServer.post('/sayHello/:eventId', function(req, res){
    const data = req.body;

    console.info(data);

    res.send('Hi');
});

apiServer.listen(8080);
