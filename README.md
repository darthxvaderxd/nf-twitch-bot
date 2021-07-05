# nf-twitch-bot

## install
1. You will need to get your twitch oauth token from: https://twitchapps.com/tmi/ (twithUserName/twitchAuthToken)
2. You will need to create an app on dev.twitch.tv and get the (clientId, clientSecret) from there
3. Create a file called `token.json` in the repository directory and add the following

```json
{
  "twitterName": "DracoCatt",
  "youtubeChannel": "https://www.youtube.com/DracoCatt",
  "twitchUsername": "DracoCatt",
  "twitchAuthToken": "oauth:08y7l5dha2l9mi7jo8ko9us0bnfpf2",
  "twitchChannels": [
    "DracoCatt"
  ],
  "twitchAPICredentials": {
    "clientId": "yours-here",
    "clientSecret": "secret-here"
  },
  "discordJoinCode": "discord-join-code",
  "discordAPI": {
    "botToken": "token-here",
    "generalChannelId": "1",
    "twitchChannelId": "2",
    "streamerRoleId": "3",
    "liveRoleId": "4",
    "serverId": "5",
    "discordUserTwitchMap": {
      "LeoSaint": "LeoSaint_",
      "DracoCatt": "DracoCatt",
      "discord-name": "twitch-name"
    }
  },
  "friendsOfStream": [
    "LeoSaint_",
    "DracoCatt",
    "DMoneyGames"
  ]
}
```

// Discord to add a bot go to
https://discordapp.com/oauth2/authorize?client_id=XXXXXXXXXXXX&scope=bot

```shell
!commands - lists commands

!hyperizing
!hypehorizen
!fifine
!shop

!roll n - rolls n dice
!so streamer - shout out a streamer

!sounds - lists sounds available
!sound sound - play a sound
!addsound - they can add a sound...

!ban name - meme

!discord - list your discord
!twitter - list your twitter
!youtube - list your tubes

!gifs - list of gifs
!gif name - play gif
!addgif - how they can add a giff

!hangman - play hangman on screen (ADMIN)
!guess a - guess a letter
!solve word - solve 

!sr name or twitch code - user can request a song request

!watch channel - tune into a twitch channel on stream (ADMIN)
!yt code - watch youtube video on stream (ADMIN)
!stop - stop watching twitch channel or yt video (ADMIN)\

!lurk - hey we love lurkers
```


scenes
```shell
http://localhost:8000/interact - this is the main scene for the bot
http://localhost:8000/music - song request stream
http://localhost:8000/lurker - allows you to lurk the streams that are live of your friends
```