const express = require('express');
const path = require('path');
const fs = require('fs');
const twitchBot = require('./server-lib/twitch-chat-bot');
const twitchApi = require('./server-lib/twitch-api');
const chatCommands = require('./chat-commands');
const port = process.env.PORT || 8000;

const app = express();

app.use(express.static(path.resolve(__dirname ,'/dist')));
app.listen(port, () =>{
    console.log(new Date(), `Server running on http://localhost:${port}/`);
});

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
    });

    response.send(JSON.stringify({ messages }));
});

app.get('/api/hangman', (request, response) => {
    const messages = [];

    // yes I know this is blocking.... but only one user should be needing it so idc
    fs.readdirSync(path.join(__dirname, '/dist/hangman')).forEach((file) => {
        if (messages.length < 1) {
            const filePath = path.join(__dirname, `/dist/hangman/${file}`);
            messages.push({ id: file, params: require(filePath) });
            // yes I know this is blocking.... but only one user should be needing it so idc
            fs.unlinkSync(filePath)
        }
    });

    response.send(JSON.stringify({ messages }));
});

app.get('*', express.static(path.join(__dirname, 'dist')));

// start twitch bot
twitchBot.connect();
twitchApi.beginLiveFriendsLoop();

chatCommands.forEach((command) => {
   twitchBot.onMessageReceived(command.command, command.cb, command.coolDown);
});
