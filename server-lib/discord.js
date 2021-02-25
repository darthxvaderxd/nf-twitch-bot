const Discord = require('discord.js');
const token = require('../token.json');
const twitch = require('./twitch-api');

const intents = new Discord.Intents(Discord.Intents.NON_PRIVILEGED);
intents.add('GUILD_MEMBERS');
const client = new Discord.Client({ ws: {intents: intents} });

const streamsToWatch = [];
let liveStreams = [];

let twitchChannel = null;
let generalChannel = null;
let myGuild = null;

client.login(token.discordAPI.botToken)
    .then(() => console.log('Connected to discord'))
    .catch((e) => console.log('Error could not connect to discord => ', e));

client.on('ready', async () => {
    // join the channel
    generalChannel = await client.channels.fetch(token.discordAPI.generalChannelId);
    twitchChannel = await client.channels.fetch(token.discordAPI.twitchChannelId);
    myGuild = client.guilds.cache.get(token.discordAPI.serverId);

    const StreamerRole = myGuild.roles.cache.get(token.discordAPI.streamerRoleId);

    // Fetch all members from a guild
    const allMembers = await myGuild.members.fetch();

    allMembers.forEach((member) => {
        if (member.roles.cache.find(r => r.id === StreamerRole.id)) {
            if (token.discordAPI.discordUserTwitchMap[member.user.username]) {
                const twitchChannel = token.discordAPI.discordUserTwitchMap[member.user.username];
                streamsToWatch.push({
                    id: member.id,
                    name: member.nickname || member.user.username,
                    twitchChannel,
                });
            }
        }
    });
});

const streamerTimer = setInterval(() => {
    streamsToWatch.forEach((streamer) => {
        twitch.isLive(streamer.twitchChannel)
            .then((live) => {
                if (live) {
                    if (!liveStreams.find(f => f === streamer.twitchChannel)) { // add role
                        console.log(new Date(), `${streamer.name} has gone live on ${streamer.twitchChannel}`);
                        liveStreams.push(streamer.twitchChannel);
                        myGuild.members.fetch(streamer.id).then((member) => {
                            member.roles.add(token.discordAPI.liveRoleId);
                            twitchChannel.send(`${streamer.name} is live at https://twitch.tv/${streamer.twitchChannel} @here`);
                        });
                    }
                } else {
                    if (liveStreams.find(f => f === streamer.twitchChannel)) { // remove role
                        console.log(new Date(), `${streamer.name} is no longer live`);
                        liveStreams = liveStreams.filter((s) => s !== streamer.twitchChannel);
                        myGuild.members.fetch(streamer.id).then((member) => {
                            member.roles.remove(token.discordAPI.liveRoleId);
                        });
                    }
                }
            })
            .catch((e) => console.error("DISCORD ERROR => ", e));
    });
}, 1000 * 2 * 60);
