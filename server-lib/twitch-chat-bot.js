const tmi = require('tmi.js');
const token = require('../token.json');
const get = require('lodash/get');
const cron = require('./cron-commands');

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
    // update count
    cron.receivedAMessage();

    console.log('target => ', target);

    context.displayName = context['display-name'];

    const rest = message.split(' ');
    const command = rest.shift();
    const { displayName, username, subscriber, mod, badges } = context;
    const isMod = mod ? mod : get(badges, 'broadcaster', 0) === '1';

    // TODO: remove this
    console.log(new Date(), `Chat Received => ${displayName}: ${message}`, 'isMod => ' , isMod);

    // logic to process commands -- this adds possibility for multiple hooks one command
    const filteredHooks = hooks.filter(
        (h) => typeof h.command === 'string' && h.command.toLowerCase() === command.toLowerCase(),
    );
    if (filteredHooks) {
        filteredHooks.forEach((hook) => {
            const {
                cb = () => {},
                coolDown = 0,
                modOnly = false,
                subscriberOnly = false,
                unlocks = undefined,
            } = hook;
            if (coolDown !== 0) { // validate not on cooldown
                const now = new Date();
                if (typeof unlocks !== 'undefined' && unlocks > now.getTime()) {
                    console.log(new Date(), `${command} is on cool down`);
                    return;
                }
                now.setSeconds(now.getSeconds() + coolDown);
                hook.unlocks = now.getTime();
            }
            if ((modOnly && !isMod) || (subscriberOnly && !subscriber)) {
                if (modOnly) {
                    client.say(target, `@${displayName} you do not have access to this moderator only command`);
                } else if (subscriberOnly) {
                    client.say(target, `@${displayName} access to this command could be yours by subscribing to the channel`);
                }
            } else {
                cb(client, {username, displayName, subscriber, isMod, command, rest}, target);
            }
        });
    }
};

module.exports.onMessageReceived = (command) => {
    if (client) {
        hooks.push(command);
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
            cron.cron(client);
        }).catch((e) => {
        console.error(new Date(), e);
    });
}
