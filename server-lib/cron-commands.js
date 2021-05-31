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
    cron: (client, receivedMessages) => {
        setInterval(() => {
            console.log('receivedMessages => ', receivedMessages);
        }, 1000);
    },
    receivedAMessage: () => receivedMessages += 1
}