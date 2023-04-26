const {Client, GatewayIntentBits, Partials} = require('discord.js');
const Keyv = require('keyv');
const fs = require('fs');

const {prefix, token, emoji_stash_servers, setup_required} = require('./config.json');
const {words, ALL_WORDS} = require('./words.json');
const emojis = require('./emojis.json');

//instance of the bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

//instance of key/value
const keyv = new Keyv();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  if (setup_required) {
    await setupEmote();
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; //ignore bot messages
  if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return; //if message does not starts with prefix
  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase(); //the command used by the user, without the prefix 
  switch (command) {
    case 'help':
      await sendHelp(message);
      break;
    case 'start':
      await sendGame(message);
      break;
    default:
      break;
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.type !== 3
     && interaction.type !== 5) return;
  switch (interaction.customId) {
    case 'guess':
      await createModal(interaction);
      break;
    case 'guessed':
      await executeModal(interaction);
      break;
    default:
      break;
  }
});

client.on('error', function (err) {
  console.log(err);
  client.login(token);
});

client.login(token);

//Defining all the functions used above
async function sendGame(message) {
  let msg = await message.reply({
    content: `<@${message.author.id}>'s game`,
    tts: false,
    components: [
      {
        type: 1,
        components: [
          {
            style: 1,
            label: `GUESS`,
            custom_id: `guess`,
            disabled: false,
            emoji: {
              id: null,
              name: `🧐`,
            },
            type: 2,
          },
        ],
      },
    ],
    embeds: [
      {
        type: 'rich',
        title: `WORDLE`,
        description: [
          `◻️ ◻️ ◻️ ◻️ ◻️`,
          `◻️ ◻️ ◻️ ◻️ ◻️`,
          `◻️ ◻️ ◻️ ◻️ ◻️`,
          `◻️ ◻️ ◻️ ◻️ ◻️`,
          `◻️ ◻️ ◻️ ◻️ ◻️`,
          `◻️ ◻️ ◻️ ◻️ ◻️`,
        ].join('\n'),
        color: 0xff0000,
        fields: [
          {
            name: `🎚️ Chances Left :`,
            value: `6`,
          },
        ],
        footer: {
          text: `Use ${prefix}help for rules and context about the game`,
        },
      },
    ],
  });

  let key = msg.id;
  let val = words[Math.floor(Math.random() * words.length)];
  await keyv.set(key, val, 75000000);
}
async function sendHelp(message) {
const desc = [
  `• After each guess, the color of the tiles will change to show how close your guess was to the word.\n`,
`**Tile color meanings:**\n`,
`${emojis.green.w} ${emojis.gray.e} ${emojis.gray.a} ${emojis.gray.r} ${emojis.gray.y}`,
`The letter **W** is present in this word and is in the correct spot.\n`,
`${emojis.gray.p} ${emojis.gray.i} ${emojis.yellow.v} ${emojis.gray.o} ${emojis.gray.t}`,
`The letter **V** is in the word but in wrong spot.\n`,
`${emojis.green.v} ${emojis.green.a} ${emojis.gray.l} ${emojis.green.u} ${emojis.green.e}`,
`The letter **L** is not in the word in any spot`
].join(`\n`);
  await message.channel.send({
    content: `**HOW TO PLAY**`,
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `Guess the WORDLE in 6 tries.`,
        description: desc,
        color: 0xa9f,
        footer: {
          text: `Play now ${prefix}start`,
        },
      },
    ],
  });
}

async function createModal(interaction) {
  if (interaction.message.content.includes(interaction.user.id)) {
    await interaction.showModal({
      custom_id: `guessed`,
      title: `Enter your guess`,
      components: [
        {
          type: 1, // Component row
          components: [
            {
              type: 4, // Text input component, only valid in modals
              custom_id: 'answer',
              label: `Enter a valid word:`,
              style: 1, // 1 for line, 2 for paragraph
              min_length: 5,
              max_length: 5,
              placeholder: 'adieu',
              required: true,
            },
          ],
        },
      ],
    });
  } else {
    await interaction.reply({
      content: 'This is not your game.',
      ephemeral: true,
    });
  }
}

async function executeModal(interaction) {
  const value = interaction.fields.getTextInputValue('answer');
  if (ALL_WORDS.includes(value.toLowerCase())) { //if the word is valid.
    const answer = await keyv.get(interaction.message.id);
    const wordArr = getColoredWord(answer, value); //Calling getColoredWord function to get the coloured alphabet emote's array
    const colouredWord = wordArr.join(' '); //Joining it
    const oldChances = parseInt(
      interaction.message.embeds[0].fields[0].value
    ); //Chances before the modal was submitted
    const newChances = oldChances - 1; //Decrementing a turn to continue game.
    let descArr = interaction.message.embeds[0].description.split('\n').reverse(); //Splitting the description from new lines, then reversing it.
    descArr[newChances] = colouredWord;//Replacing the next '◻️ ◻️ ◻️ ◻️ ◻️' with the coloured word, which was entered by the player
   let newDesc = descArr.reverse().join('\n'); //getting the new description up by reversing and joining with new lines.

    const count = descArr.reduce(
      (count, el) => (!el.includes('◻️') ? count + 1 : count),
      0
    );//Turns taken by the player reaching the correct word.
    let msg = {
      content: `<@${interaction.user.id}>'s game`,
      tts: false,
      components: [
        {
          type: 1,
          components: [
            {
              style: 1,
              label: `GUESS`,
              custom_id: `guess`,
              disabled: true,
              emoji: {
                id: null,
                name: `🧐`,
              },
              type: 2,
            },
          ],
        },
      ],
      embeds: [
        {
          type: 'rich',
          title: `WORDLE`,
          description: `${newDesc}`,
          color: 0xff0000,
          fields: [
            {
              name: `🏆 YOU WON`,
              value: `Your performance: \`${count}/6\``,
            },
          ],
          footer: {
            text: `Use ${prefix}help for rules and context about the game`,
          },
        },
      ],
    }; // The message when the player wins, it is updated below depending on the game status 
    if (!wordArr.some((element) => !element.includes('green'))) {
      // If the player wins
      await keyv.delete(interaction.message.id);
    } else if (oldChances == 1) {
      // Updating the msg object for when the user loses
      msg.embeds[0].fields[0].name = '🦆 You Lost';
      msg.embeds[0].fields[0].value = `The word was ${answer}`;
      await keyv.delete(interaction.message.id);
    } else {
      // If the game is not over
      msg.components[0].components[0].disabled = false;
      msg.embeds[0].fields[0].name = '🎚️ Chances Left :';
      msg.embeds[0].fields[0].value = newChances;
    }
    await interaction.deferUpdate();//Deferring the interaction as we are not responding to it.
    await interaction.message.edit(msg);//Editing the game message
  } else {
    await interaction.reply({
      content: 'Please enter a valid word.',
      ephemeral: true,
    });
  }
}

function getColoredWord(answer, guess) {
  let coloredWord = [];
  for (let i = 0; i < guess.length; i++) {
    coloredWord.push(emojis.gray[guess[i]]);
  }
  let guessLetters = guess.split('');
  let answerLetters = answer.split('');

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      coloredWord[i] = emojis.green[guessLetters[i]];
      answerLetters[i] = null;
      guessLetters[i] = null;
    }
  }

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] && answerLetters.includes(guessLetters[i])) {
      coloredWord[i] = emojis.yellow[guessLetters[i]];
      answerLetters[answerLetters.indexOf(guessLetters[i])] = null;
    }
  }
  return coloredWord;
}
function getAlphabetIndex(int) {
  const baseCharCode = 'a'.charCodeAt(0);
  return String.fromCharCode(baseCharCode + int);
}
async function setupEmote() {
  // For uploading accessible alphabet emotes and updating the emoji.json file.
  console.log('Setting up Emotes...\n');
  let emojiObj = {
    green: {},
    gray: {},
    yellow: {},
  };
  let colors = ['green', 'yellow', 'gray'];
  for (let i = 0; i < 3; i++) {
    console.log(`Adding ${colors[i]} emojis...`);
    let guild = client.guilds.cache.get(emoji_stash_servers[i]);
    for (let j = 0; j < 26; j++) {
      let crEmote = emojis[colors[i]][getAlphabetIndex(j)];
      const regex = /\d+(\.\d+)?/g;
      const matches = crEmote.match(regex);
      let attachment = `https://cdn.discordapp.com/emojis/${matches[0]}.png`;
      let name = `${colors[i]}_${getAlphabetIndex(j)}`;
      let emoji = await guild.emojis.create({
        attachment: attachment,
        name: name,
      });
      emojiObj[colors[i]][getAlphabetIndex(j)] = `<:${emoji.name}:${emoji.id}>`;
    }
    console.log(done!)
  }
  let json = JSON.stringify(emojiObj, null, 2);
  fs.writeFile('emojis.json', json, (err) => { if (err) throw err; });

  const configObj = JSON.parse(fs.readFileSync('config.json'));
  configObj.setup_required = false;
  const updatedConfigData = JSON.stringify(configObj, null, 2);
  fs.writeFileSync('config.json', updatedConfigData);
  console.log('Process Completed! Alphabet emotes are all set!');
}
