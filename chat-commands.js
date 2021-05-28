module.exports = [
    {
        command: '!battle',
        cb: (client, params, target) => {
            client.say(target, 'Join the battle at https://www.streamraiders.com/t/leosaint_');
        },
        coolDown: 5,
    },
];
