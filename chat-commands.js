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
            client.say(target, 'Commands: !gifs !sounds !roll !addsound !ban !twitter !youtube !sr !discord !deck !<class> !battle');
        },
        coolDown: 0,
    },
    /* @HypeHorizen Hype Rizing Team */
    {
        command: '!hyperizing',
        cb: (client, params, target) => {
            client.say(target, 'Join the Hype Horizen Community Team by visiting https://hypehorizen.com/hype-rizing');
        },
        coolDown: 0,
    },
    {
        command: '!hypehorizen',
        cb: (client, params, target) => {
            client.say(target, 'Get hyped up! Hype Horizen is an awesome team of players and streamers, check out my team and cheer us on https://hypehorizen.com');
        },
        coolDown: 0,
    },
    {
        command: '!fifine',
        cb: (client, params, target) => {
            client.say(target, 'Hype Rizing and Hype Horizen is sponsored by FIFINE Technology https://hypehorizen.com/fifinerizing a company that specializes in giving streamers like me affordable, quality audio products and microphones')
        },
        coolDown: 0,
    },
    {
        command: '!shop',
        cb: (client, params, target) => {
            client.say(target, 'Get Hype Merch! https://hypehorizen.com/shop My team has tees, hoodies and merch available for gamers')
        },
        coolDown: 0,
    },
];
