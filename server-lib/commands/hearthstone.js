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
        command: '!priest',
        cb: (client, params, target) => {
            client.say(target, 'God grant me the serenity to except the things I cannot change, the courage to change the things and can and the wisdom to know the difference');
        },
        coolDown: 5,
    },
    {
        command: '!pally',
        cb: (client, params, target) => {
            client.say(target, 'If you cannot beat them join them');
        },
        coolDown: 5,
    },
    {
        command: '!paladin',
        cb: (client, params, target) => {
            client.say(target, 'If you cannot beat them join them');
        },
        coolDown: 5,
    },
    {
        command: '!hunter',
        cb: (client, params, target) => {
            client.say(target, 'Senpai HattriK and SidsiTV would be disappointed in me');
        },
        coolDown: 5,
    },
    {
        command: '!shammy',
        cb: (client, params, target) => {
            client.say(target, 'MSGA - Make shammy great again');
        },
        coolDown: 5,
    },
    {
        command: '!shaman',
        cb: (client, params, target) => {
            client.say(target, 'MSGA - Make shammy great again');
        },
        coolDown: 5,
    },
    {
        command: '!warlock',
        cb: (client, params, target) => {
            client.say(target, 'Oh you are waiting for that perfect card? DELETED... 8/8 to deal with too');
        },
        coolDown: 5,
    },
    {
        command: '!warrior',
        cb: (client, params, target) => {
            client.say(target, 'Maybe we need to run Mankrik too');
        },
        coolDown: 5,
    },
    {
        command: '!rogue',
        cb: (client, params, target) => {
            client.say(target, 'Yeah painful to watch me play it eh, hate to face em in the right hands');
        },
        coolDown: 5,
    },
    {
        command: '!mage',
        cb: (client, params, target) => {
            client.say(target, 'Like to gamble? Play mage!');
        },
        coolDown: 5,
    },
    {
        command: '!demonhunter',
        cb: (client, params, target) => {
            client.say(target, 'We said we would never play this class, now we jamming it');
        },
        coolDown: 5,
    },
    {
        command: '!dh',
        cb: (client, params, target) => {
            client.say(target, 'We said we would never play this class, now we jamming it');
        },
        coolDown: 5,
    },
    {
        command: '!druid',
        cb: (client, params, target) => {
            client.say(target, 'Enough with the memes already');
        },
        coolDown: 5,
    },
    {
        command: '!coaching',
        cb: (client, params, target) => {
            client.say(target, 'If you want me for a coach I am flattered and can name many other people you should use. Should you insist msg me on !discord');
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