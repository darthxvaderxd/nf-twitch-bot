const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid')

const saveQueueMessage = (message) => {
    const now = new Date();
    fs.writeFileSync(
        path.join(__dirname, `/dist/messages/${now.valueOf()}-${uuidv4()}.json`),
        JSON.stringify(message),
    );
}

/**
 * This allows you to add custom chat commands, just read up on javascript if you don't know about it...
 * @type {({command: string, cb: cb}|{command: string, cb: cb})[]}
 *
 * This is an array of objects with expected command which is a string and cb which is a function to call back
 */
module.exports = [
    {
        command: '!roll',
        cb: (client, params, target) => {
            let numberOfDice = params.rest[0] ? Number(params.rest[0]) : 1;
            const rolls = [];

            if ( numberOfDice > 10) {
                client.say(target, `@${params.displayName} nice try ${numberOfDice} is too high limit is 10 dice`);
            } else {
                for (let i = 0; i < numberOfDice; i += 1) {
                    rolls.push(Math.ceil(Math.random() * 6));
                }

                const sum = rolls.reduce((a, b) => a + b);
                const word = numberOfDice > 1 ? 'dice' : 'die';
                const extra = numberOfDice === 1 ? '' : ` totaling ${sum}`;

                const message = `@${params.displayName} rolled ${numberOfDice} ${word}: [${rolls.join(', ')}]${extra}`;
                saveQueueMessage({
                    ...params,
                    numberOfDice,
                    rolls,
                });
                client.say(target, message);
            }
        },
    },
    {
        command: '!so',
        cb: (client, params, target) => {
            if (params.isMod) {
                const user = (params.rest[0] || params.displayName).replace('@', '');
                const message = `Hey do me a huge favor and go checkout out @${user} at https://twitch.tv/${user}`;
                saveQueueMessage({
                    ...params,
                    shoutOut: user,
                });
                client.say(target, message);
            }
        },
    },
    {
        command: '!botcode',
        cb: (client, params, target) => {
            client.say(target, 'You can get the bot source code at https://github.com/darthxvaderxd/nf-twitch-bot');
        },
    },
]
