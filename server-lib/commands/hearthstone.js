const {
    twitchUsername = 'n/a',
} = require('../../token.json');

/**
 * This allows you to add custom chat commands, just read up on javascript if you don't know about it...
 * @type {({command: string, cb: cb, coolDown: number})[]}
 *
 * This is an array of objects with expected command which is a string and cb which is a function to call back
 * if you want the command to have a coolDown set it to a number in seconds
 */
module.exports = [
    {
        command: '!lfg',
        cb: (client, params, target) => {
            client.say(target, 'Check out this new Conquest Looking for Game Discord to practice Bo3 and bo5 games for tournaments like Masters Tour Qualifiers without losing ladder ranks. https://discord.gg/vyNpQdfB');
        },
        coolDown: 5,
    },
    {
        command: '!deck',
        cb: (client, params, target) => {
            client.say(target, `To see the decks I have been playing go to: https://d0nkey.top/streamer-decks?twitch_login=${twitchUsername.toLowerCase()}`);
        },
        coolDown: 5,
    },
    {
        command: '!olgra',
        cb: (client, params, target) => {
            client.say(target, 'OLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLGRAAAAAAAAAAAAAAAAAAA SMOrc');
        },
        coolDown: 5,
    },
];