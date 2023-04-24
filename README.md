## Wordle in Discord!

[![Invite my Wordle Bot](https://media.discordapp.net/attachments/895715784280653835/1100151208720744559/PicsArt_04-25-01.37.26.png)](https://dsc.gg/wordlebot)

### Introduction
This is a Discord bot that allows you to play the game of Wordle in your Discord Server. It is a simple yet addictive word guessing game that challenges players to guess a five-letter word in six chances.

### Installation
Before installing and running this bot, make sure you have [Node.js](https://nodejs.org/) installed on your machine. Then follow these steps:
1. Clone the repository.
2. Navigate to the repository directory and run the following command in your terminal to install all the required dependencies:
```
npm install
```

### Configuration
In the `config.json` file, fill in the following fields:
* `prefix`: The prefix you want to use for the bot commands.
* `token`: Your Discord bot token. You can get this by creating a new bot on the [Discord Developer Portal](https://discord.com/developers/applications).
* `emoji_stash_servers`: An array of server IDs where the bot can access the custom emojis that will be used in the game. Create 3 servers and invite your bot there and paste the servers' IDs in the array. It will get automatically set-up at the time of running!
* `setup_required`: A boolean that determines whether the bot needs to set up custom emojis for the game. Leave this field as it is.

### Start-up
Start the bot by running the following command in your terminal:
```
node index.js
```

### Usage
To start the game, type the prefix followed by the `start` command in any text channel where the bot is present. The bot will send a message with the word hidden and a keyboard with letters to guess. Click the `GUESS` button to make a guess. If you guess the letter correctly, it will appear in the hidden word with a green background. If you guess incorrectly, the letter will appear in the keyboard with a red background, and you will lose one chance. If you can guess the word in six chances, you win!

The available commands are:
* `help`: Sends a message with the game rules and how to play.
* `start`: Starts a new game.

### License
This project is licensed under the MIT License.
