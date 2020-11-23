# nf-twitch-bot

## install
1. You will need to get your twitch oauth token from: https://twitchapps.com/tmi/ (twithUserName/twitchAuthToken)
2. You will need to create an app on dev.twitch.tv and get the (clientId, clientSecret) from there
3. Create a file called `token.json` in the repository directory and add the following

```json
{
  "twitchUsername": "your-user-name",
  "twitchAuthToken": "your-token-here",
  "twitchChannels": [
    "channel1",
    "channel2"
  ],
  "twitchAPICredentials": {
    "clientId": "your-id",
    "clientSecret": "your-secret"
  },
  "friendsOfStream": [
    "streamer1",
    "streamer2"
  ]
}
```
