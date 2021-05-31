const customCommands = require('../custom-cron-chat');

const cronCommands = [
    {
        message: 'If you like the stream please hit that follow button',
        on: true,
    },
    ...customCommands,
];

const sentMessages = [];

let receivedMessages = 0;

module.exports = {
    cron: (client) => {
        setInterval(() => {
            if (receivedMessages > 10) {
                receivedMessages = 0;
                client.say()
            }
        }, 5000);
    },
    receivedAMessage: () => receivedMessages += 1
}