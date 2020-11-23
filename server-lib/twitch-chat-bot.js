const tmi = require('tmi.js');
const token = require('../token.json');
const get = require('lodash/get');

const params = {
    identity: {
        username: token.twitchUsername,
        password: token.twitchAuthToken,
    },
    channels: token.twitchChannels,
};

const hooks = [];

let client = null;

const onMessageHandler =  (target, context, message, self) => {
    context.displayName = context['display-name'];

    const rest = message.split(' ');
    const command = rest.shift();
    const { displayName, username, subscriber, mod, badges } = context;
    const isMod = mod ? mod : get(badges, 'broadcaster', 0) === '1';

    // TODO: remove this
    console.log(new Date(), `Chat Received => ${displayName}: ${message}`, 'isMod => ' , isMod);

    // logic to process commands -- this adds possibility for multiple hooks one command
    const filteredHooks = hooks.filter((h) => h.command.toLowerCase() === command.toLowerCase());
    if (filteredHooks) {
        filteredHooks.forEach((hook) => {
            if (hook.coolDown !== 0) { // validate not on cooldown
                const now = new Date();
                if (typeof hook.unlocks !== 'undefined' && hook.unlocks > now.getTime()) {
                    console.log(new Date(), `${command} is on cool down`);
                    return;
                }
                now.setSeconds(now.getSeconds() + hook.coolDown);
                hook.unlocks = now.getTime();
            }
           hook.cb(client, { username, displayName, subscriber, isMod, command, rest}, target);
        });
    }
};

module.exports.onMessageReceived = (command, cb, coolDown) => {
    if (client) {
        hooks.push({ command, cb, coolDown });
    } else {
        console.log(new Date(), 'You need to call connect first');
    }
};

module.exports.connect = () => {
    client = new tmi.client(params);

    client.on('message', onMessageHandler);
    client.on('connected', (address, port) => {
        console.log(new Date(), `Connected to ${address}:${port}`);
    });

    client.connect()
        .then(() => {
            console.log(new Date(), 'Twitch bot connected');
        }).catch((e) => {
        console.error(new Date(), e);
    });
}