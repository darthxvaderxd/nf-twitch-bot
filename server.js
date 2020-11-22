const express = require('express');
const path = require('path');
const fs = require('fs');
const twitchBot = require('./server-lib/twitch-bot');
const chatCommands = require('./chat-commands');

const app = express();

app.use(express.static(path.resolve(__dirname ,'/dist')));
app.listen(8000);

app.get('/api/queue', (request, response) => {
    const messages = [];

    // yes I know this is blocking.... but only one user should be needing it so idc
    fs.readdirSync(path.join(__dirname, '/dist/messages')).forEach((file) => {
        if (messages.length < 10) {
            const filePath = path.join(__dirname, `/dist/messages/${file}`);
            messages.push({ id: file, params: require(filePath) });
            // yes I know this is blocking.... but only one user should be needing it so idc
            fs.unlinkSync(filePath)
        }
    })

    response.send(JSON.stringify({ messages }));
});

app.get('*', express.static(path.join(__dirname, 'dist')));

// start twitch bot
twitchBot.connect();

chatCommands.forEach((command) => {
   twitchBot.onMessageReceived(command.command, command.cb);
});
