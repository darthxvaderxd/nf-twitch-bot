module.exports = [
    {
        command: '!battle',
        cb: (client, params, target) => {
            client.say(target, 'Join the battle at https://www.streamraiders.com/t/leosaint_');
        },
        coolDown: 5,
    },
    {
        command: '!commands',
        cb: (client, params, target) => {
            client.say(target, '!gifs !sounds !roll !addsound !ban !twitter !youtube !sr !discord !deck !<class> !battle');
        },
        coolDown: 0,
    },
];
