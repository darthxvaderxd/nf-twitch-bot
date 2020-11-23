const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid')
const { getUser } = require('./server-lib/twitch-api');

const requireSub = false

const saveQueueMessage = (message) => {
    const now = new Date();
    fs.writeFileSync(
        path.join(__dirname, `/dist/messages/${now.valueOf()}-${uuidv4()}.json`),
        JSON.stringify(message),
    );
}


const clearHangman = () => {
    fs.readdirSync(path.join(__dirname, '/dist/hangman')).forEach((file) => {
        // yes I know this is blocking.... but only one user should be needing it so idc
        fs.unlinkSync(path.join(__dirname, `/dist/hangman/${file}`))
    });
}
const saveHangManGuess = (message) => {
    const now = new Date();
    fs.writeFileSync(
        path.join(__dirname, `/dist/hangman/${now.valueOf()}-${uuidv4()}.json`),
        JSON.stringify(message),
    );
}

/**
 * This allows you to add custom chat commands, just read up on javascript if you don't know about it...
 * @type {({command: string, cb: cb, coolDown: number})[]}
 *
 * This is an array of objects with expected command which is a string and cb which is a function to call back
 * if you want the command to have a coolDown set it to a number in seconds
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
                    rolls.push(Math.floor(Math.random() * 6) + 1);
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
        coolDown: 10,
    },
    {
        command: '!so',
        cb: async (client, params, target) => {
            if (params.isMod) {
                const userName = (params.rest[0] || params.displayName).replace('@', '');
                const user = await getUser(userName);
                let stream = null;
                try {
                    const filePath = path.join(__dirname, `dist/streams/${userName.toLowerCase()}.json`);
                    stream = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                } catch (e) {
                    // do nothing
                }
                const message = !stream
                    ? `Hey do me a huge favor and go checkout out @${userName} at https://twitch.tv/${userName}`
                    : `Hey do me a huge favor and go checkout out @${userName} at https://twitch.tv/${userName}`
                    + ` they were last seen playing ${stream.game_name}`;
                saveQueueMessage({
                    ...params,
                    shoutOut: userName,
                    user: user ? user._data : undefined,
                    stream,
                });
                client.say(target, message);
            }
        },
        coolDown: 10,
    },
    {
        command: '!botcode',
        cb: (client, params, target) => {
            client.say(target, 'You can get the bot source code at https://github.com/darthxvaderxd/nf-twitch-bot');
        },
        coolDown: 0,
    },
    {
        command: '!sounds',
        cb: (client, params, target) => {
            const sounds = [
                'boo1',
                'crybaby',
                'doh',
                'doit',
                'fart1',
                'fart2',
                'fart3',
                'odd',
                'oops',
                'pika',
                'scream1',
                'tilted1',
            ];
           client.say(target, `Available sounders are ${sounds.join(', ')}, you can do !sound <sound>, this is a sub only command`);
        },
        coolDown: 10,
    },
    {
        command: '!sound',
        cb: (client, params, target) => {
            if ((params.subscriber || params.isMod) && requireSub || !requireSub) {
                saveQueueMessage({
                    ...params,
                });
            }
        },
        coolDown: 10,
    },
    {
        command: '!ban',
        cb: (client, params, target) => {
            const user = (params.rest[0] || params.displayName).replace('@', '');
            client.say(target, `@${user} has been banned Kappa`);
        },
        coolDown: 5,
    },
    {
        command: '!addsound',
        cb: (client, params, target) => {
            client.say(target, `if you are a sub you can add a sound just give me an mp3 in dm`);
        },
        coolDown: 5,
    },
    {
        command: '^',
        cb: (client, params, target) => {
            client.say(target, '^^');
        },
        coolDown: 5,
    },
    {
        command: '!twitter',
        cb: (client, params, target) => {
            client.say(target, 'add me on twitter at https://twitter.com/LeoSaintPoker');
        },
        coolDown: 5,
    },
    {
        command: '!gifs',
        cb: (client, params, target) => {
            const images = [
                'cat1',
                'cat2',
                'catdance1',
                'catdance2',
                'madbro',
                'nailedit',
                'nooo',
                'salty',
                'tableflip1',
                'tableflip2',
                'tilted',
            ];
            client.say(target, `Available gifs are ${images.join(', ')}, you can do !gif <gif>, this is a sub only command`);
        },
        coolDown: 10,
    },
    {
        command: '!gif',
        cb: (client, params, target) => {
            if ((params.subscriber || params.isMod)  && requireSub || !requireSub) {
                saveQueueMessage({
                    ...params,
                });
            }
        },
        coolDown: 10,
    },
    {
        command: '!addgif',
        cb: (client, params, target) => {
            client.say(target, `if you are a sub you can add a gif just give me a link to the picture in dm`);
        },
        coolDown: 5,
    },
    {
        command: '!hangman',
        cb: (client, params, target) => {
            if (params.isMod) {
                clearHangman();
                saveQueueMessage({
                    ...params,
                });

                client.say(target, `@${params.displayName} has started a game of hangman, to guess type !guess <letter>, !solve <word>`);
            }
        },
        coolDown: 5,
    },
    {
        command: '!guess',
        cb: (client, params, target) => {
            if (params.rest.length > 0) {
                saveHangManGuess({
                    letter: params.rest[0].toLowerCase(),
                    word: false,
                });
            }
        },
        coolDown: 0,
    },
    {
        command: '!solve',
        cb: (client, params, target) => {
            if (params.rest.length > 0) {
                saveHangManGuess({
                    letter: false,
                    word: params.rest[0].toLowerCase(),
                });
            }
        },
        coolDown: 0,
    },
]
