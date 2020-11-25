const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const yts = require( 'yt-search' );

const saveSongRequest = (video) => {
    const now = new Date();
    fs.writeFileSync(
        path.join(__dirname, `../../dist/song_requests/${now.valueOf()}-${uuidv4()}.json`),
        JSON.stringify(video),
    );
}

const saveSkipSong = (skipSong) => {
    fs.writeFileSync(path.join(__dirname, '../../dist/streams/_skip.json'), JSON.stringify({ skipSong }));
}

const savePauseSong = (pauseSong) => {
    fs.writeFileSync(path.join(__dirname, '../../dist/streams/_pause.json'), JSON.stringify({ pauseSong }));
}

module.exports = [
    {
        command: '!sr',
        cb: async (client, params, target) => {
            // for now if rest is just 1 then it's a videoId, if its more its not
            let video = null
            const ytSearch = async (searchPhrase) => {
                try {
                    const results = await yts(searchPhrase);
                    video = results.videos.length > 1
                        ? results.videos[0]
                        : null;
                } catch (e) {
                    // do nothing
                }
            }
            if (params.rest.length > 0) {
                const isSongId = params.rest.length === 1;
                if (isSongId) {
                    try {
                        video = await yts({videoId: params.rest[0]});
                    } catch (e) {
                        // do nothing
                    }
                    if (!video) {
                        await ytSearch(params.rest[0]);
                    }
                } else {
                    const searchPhrase = params.rest.join(' ');
                    await ytSearch(searchPhrase);
                }
                if (video) {
                    const author = typeof video.author !== 'undefined'
                        ? ` by ${video.author.name}`
                        : '';
                    saveSongRequest(video);
                    client.say(target, `Added ${video.title}${author} to queue`);
                } else {
                    client.say(target, 'Song not found');
                }
            } else {
                client.say(target, 'You can add a song request with a search term or YouTube video id');
            }
        },
        coolDown: 0,
    },
    {
        command: '!skip',
        cb: (client, params, target) => {
            if (params.isMod) {
                saveSkipSong(true);
                savePauseSong(false);
                client.say(target, 'Good Lord this song... Skipping');
            }
        },
        coolDown: 0,
    },
    {
        command: '!pause',
        cb: (client, params, target) => {
            if (params.isMod) {
                savePauseSong(true);
                client.say(target, 'Song requests are paused');
            }
        },
        coolDown: 0,
    },
    {
        command: '!resume',
        cb: (client, params, target) => {
            if (params.isMod) {
                savePauseSong(false);
                client.say(target, 'Song requests are resumed');
            }
        },
        coolDown: 0,
    },
];

module.exports.saveSkipSong = saveSkipSong;
