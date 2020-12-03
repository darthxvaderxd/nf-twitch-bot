const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider  } = require('twitch-auth');
const fs = require('fs');
const path = require('path');
const tokenData = require('../token.json');

const { clientId, clientSecret } = tokenData.twitchAPICredentials;
const { friendsOfStream } = tokenData;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const liveFriends = [];
let isQueryingLive = false;
let timmy = null;

const getUser = (userName) => {
    return apiClient.helix.users.getUserByName(userName);
}

const getStream = (userName) => {
    return apiClient.helix.streams.getStreamByUserName(userName);
}

// Code for checking if friends are live
const isStreamLive = async (userName) => {
    try {
        const user = await getUser(userName);
        if (!user) {
            return false;
        }

        const stream = await getStream(userName);
        if (stream) { // save the latest stream info we can use this later
            fs.writeFileSync(path.join(__dirname, `../dist/streams/${userName.toLowerCase()}.json`), JSON.stringify(stream._data, null, 2));
        }
        if (typeof user.getStream !== 'undefined') {
            return await user.getStream() !== null;
        }
    } catch (e) {
        console.error(new Date(), e);
    }
    return false;
}

const checkLiveFriends = async () => {
    for (let i = 0; i < friendsOfStream.length; i += 1) {
        const username = friendsOfStream[i];
        const clearUser = () => {
            const index = liveFriends.indexOf(username);
            if (index > -1) {
                liveFriends.splice(index, 1);
            }
        }
        try {
            const live = await isStreamLive(username);
            if (live && !liveFriends.includes(username)) {
                liveFriends.push(username);
            } else if (!live && liveFriends.includes(username)) {
                clearUser();
            }
        } catch (e) {
            clearUser();
            console.error(new Date(), e);
        }
    }

    // TODO: remove this console log
    console.log(new Date(), 'these friends are live => ', liveFriends);
}

module.exports.beginLiveFriendsLoop = () => {
    checkLiveFriends()
        .then(() => {
            timmy = setInterval(async () => {
                if (!isQueryingLive) {
                    isQueryingLive = true;
                    await checkLiveFriends();
                    isQueryingLive = false;
                }
            }, 60 * 1000);
        });
}
module.exports.getLiveFriends = () => liveFriends;
module.exports.getUser = getUser;
module.exports.getStream = getStream;
module.exports.isLive = isStreamLive;
