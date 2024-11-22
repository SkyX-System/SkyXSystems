require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const { CommandKit } = require('commandkit');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

new  CommandKit({
  client,
  devGuildIds: ['1077538563282972742'],
  devUserIds: ['467393849182912526'],
  eventsPath: `${__dirname}/events`,
  commandsPath:  `${__dirname}/commands`,
  bulkRegister: true,
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅Connected to DB');

  } catch (error) {
    console.log(`error in DB: ${error}`);
  }
})();

client.login(process.env.TOKEN);