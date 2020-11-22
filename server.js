const express = require('express');
const path = require('path');
const twitchBot = require('./server-lib/twitch-bot');
const chatCommands = require('./chat-commands');

const app = express();

app.use(express.static(path.resolve(__dirname ,'/dist')));
app.get('*', function(res,req){
    res.sendFile(path.resolve(__dirname ,'/dist/index.html'));
});

app.listen(8000);

// start twitch bot
twitchBot.connect();

chatCommands.forEach((command) => {
   twitchBot.onMessageReceived(command.command, command.cb);
});
