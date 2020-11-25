const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const twitchBot = require('./server-lib/twitch-chat-bot');
const twitchApi = require('./server-lib/twitch-api');
const customChatCommands = require('./chat-commands');
const { saveSkipSong } = require('./server-lib/commands/song-requests');
const port = process.env.PORT || 8000;

const app = express();

function serveIndex(request, response) {
    response.sendFile(path.join(__dirname + '/dist/index.html'));
}

app.use(express.static(path.resolve(__dirname ,'/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

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
            fs.unlinkSync(filePath);
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
            fs.unlinkSync(filePath);
        }
    });

    response.send(JSON.stringify({ messages }));
});

app.get('/api/watch', (request, response) => {
    let data = { stopWatchStream: false }
    try {
        // yes I know this is blocking.... but only one user should be needing it so idc
        const text = fs.readFileSync(path.join(__dirname, 'dist/streams/_watching.json'), 'utf8');
        data = JSON.parse(text);
    } catch (e) {
       // meh, yolo
    }

    response.send(JSON.stringify(data));
});

app.get('/api/song_requests', (request, response) => {
    const songs = [];

    // yes I know this is blocking.... but only one user should be needing it so idc
    fs.readdirSync(path.join(__dirname, '/dist/song_requests')).forEach((file) => {
        if (songs.length < 10) {
            const filePath = path.join(__dirname, `/dist/song_requests/${file}`);
            songs.push({ id: file, params: require(filePath) });
            // yes I know this is blocking.... but only one user should be needing it so idc
            fs.unlinkSync(filePath);
        }
    });

    response.send(JSON.stringify({ songs }));
});

app.get('/api/should_skip_song', (request, response) => {
    let data = { skipSong: false }
    try {
        // yes I know this is blocking.... but only one user should be needing it so idc
        const text = fs.readFileSync(path.join(__dirname, 'dist/streams/_skip.json'), 'utf8');
        data = JSON.parse(text);
        if (data.skipSong) {
            saveSkipSong(false);
        }
    } catch (e) {
        // meh, yolo
    }

    response.send(JSON.stringify(data));
});

app.get('/api/should_pause_song', (request, response) => {
    let data = { pauseSong: false }
    try {
        // yes I know this is blocking.... but only one user should be needing it so idc
        const text = fs.readFileSync(path.join(__dirname, 'dist/streams/_pause.json'), 'utf8');
        data = JSON.parse(text);
    } catch (e) {
        // meh, yolo
    }

    response.send(JSON.stringify(data));
});

app.post('/api/new_trivia_question', (request, response) => {
    try {
        // blocking i know :p, we've been over this
        const now = new Date();
        fs.writeFileSync(
            path.join(__dirname, `/dist/trivia_questions/${now.valueOf()}-${uuidv4()}.json`),
            JSON.stringify(request.body),
        );
        return { result: 'ok' };
    } catch (e) {
        console.log(e);
        return { error: e.message };
    }
});

app.get('/interact', serveIndex);
app.get('/music', serveIndex);
app.get('/game/trivia', serveIndex);
app.get('/trivia/admin', serveIndex);

app.get('*', express.static(path.join(__dirname, 'dist')));

// start twitch bot
twitchBot.connect();
twitchApi.beginLiveFriendsLoop();

// load the packaged commands
fs.readdirSync(path.join(__dirname, '/server-lib/commands')).forEach((file) => {
    const chatCommands = require(path.join(__dirname, `/server-lib/commands/${file}`));
    chatCommands.forEach((command) => {
        twitchBot.onMessageReceived(command.command, command.cb, command.coolDown);
    });
});

// load the user customized chat commands
customChatCommands.forEach((command) => {
   twitchBot.onMessageReceived(command.command, command.cb, command.coolDown);
});
