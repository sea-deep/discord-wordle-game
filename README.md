# Wordle in Discord!

### 🤓 Introduction
This is a Discord bot that allows you to play the game of Wordle in your Discord Server. It is a simple yet addictive word guessing game that challenges players to guess a five-letter word in six chances.

### 🎥 Preview
This is how it works!!
![Start Game Screen Recording](https://media.discordapp.net/attachments/1099873225778929727/1100884959020986439/ezgif-1-b4d6977096.gif)
and here winnin'
![Win game screen recording](https://media.discordapp.net/attachments/1099873225778929727/1100884959499145306/ezgif-1-92c5b2fe36.gif)

### 🚀 Installation
Before installing and running this bot, make sure you have [Node.js](https://nodejs.org/) installed on your machine. Then follow these steps:
1. Clone the repository.
2. Navigate to the repository directory and run the following command in your terminal to install all the required dependencies:
```
npm install
```

### ⚙️ Configuration
In the `config.json` file, fill in the following fields:
* `prefix`: The prefix you want to use for the bot commands.
* `token`: Your Discord bot token. You can get this by creating a new bot on the [Discord Developer Portal](https://discord.com/developers/applications).
* `emoji_stash_servers`: An array of server IDs where the bot can access the custom emojis that will be used in the game. Create 3 servers and invite your bot there and paste the servers' IDs in the array. It will get automatically set-up at the time of running! (**make sure your bot has Manage Emotes permission there**)
* `setup_required`: A boolean that determines whether the bot needs to set up custom emojis for the game. Leave this field as it is.

### ▶️ Start-up
Start the bot by running the following command in your terminal:
```
node index.js
```

### 👉 Commands 
The available commands are:
* `help`: Sends a message with the game rules and how to play.
* `start`: Starts a new game.

### 🔑 Key Features
- Using button & modals to get user response instead of message replies.
- Auto configuration for 26*3 coloured alphabet emotes, just have to provide 3 guild IDs!
- i forgot