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
let target = null;

// potential for infinite loop...
const getNextMessage = () => {
    if (cronCommands.length < 1 && sentMessages < 1) return;
    if (cronCommands.length < 1) {
        sentMessages.forEach((m) => cronCommands.push(m));
    }

    const message = cronCommands.pop();
    sentMessages.push(message);
    if (message.on === true) {
        return message.message;
    } else {
        return getNextMessage();
    }
}

module.exports = {
    cron: (client) => {
        setInterval(() => {
            if (target !== null && receivedMessages > 20) {
                receivedMessages = 0;
                client.say(target, getNextMessage())
            }
        }, 5000);
    },
    receivedAMessage: () => receivedMessages += 1,
    setClientTarget: (t) => target = t,
}