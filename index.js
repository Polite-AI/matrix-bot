const config = require('./config.js');
console.info(`Creating ${config.bots.length} bots`);

global.Olm = require('olm');
const sdk = require('matrix-js-sdk');
const fs = require('fs');
const makeMessageResponder = require('personality-helper');

config.bots.forEach((botConfig) => {
    console.info(`Starting PoliteAI Matrix Bot using [${botConfig.userId}]`);

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

    const messageResponder = makeMessageResponder(config.personalityServer, botConfig.language, botConfig.personality);

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


        const messageBody = event.getContent().body;
        //handleMessage(messageBody, room, event, client, botConfig.language);


        const response = await messageResponder(messageBody, 'matrix', room.roomId, event.event.event_id, event.event.origin_server_ts);
        if (response && response.response) {
            client.sendTextMessage(room.roomId, `${event.getSender()}: ${response.response}`);
        } else if (response && response.error) {
            console.warn(`Got an error from server for message [${messageBody}]`, response.error);
        }
    });

    client.on("RoomMember.membership", function (event, member) {
        if (member.membership === "invite" && member.userId === botConfig.userId) {
            client.joinRoom(member.roomId).done(function () {
                console.log("Auto-joined %s", member.roomId);
                /*const room_key = require('crypto').createHash('sha256', salt)
                                    .update('matrix'+member.roomId)
                                    .digest('base64');*/
                client.sendTextMessage(member.roomId, 'Polite.AI bot has entered the building...\nTeach me more at http://api.polite.ai/admin/');
            });
        }
    });

});





// const bodyParser = require('body-parser');
// const express = require('express');
// const apiServer = express();

// const pgp = require('pg-promise')();
// const db = pgp(config.postgres);

// apiServer.use(express.static('./client'));
// apiServer.use(bodyParser.json());

// apiServer.get('/admin/:roomKey', function (req, res) {
//     fs.createReadStream('./client/index.html').pipe(res);
// });

// apiServer.get('/getMessages/:roomKey', function (req, res) {
//     const roomKey = req.params.roomKey;

//     db.query(`SELECT * from messages WHERE room_id='${roomKey}'`)
//         .then(data => {
//             res.send(data);
//         });
// });

// apiServer.post('/sayHello/:eventId', function (req, res) {
//     const data = req.body;

//     console.info(data);

//     res.send('Hi');
// });

// apiServer.listen(8080);