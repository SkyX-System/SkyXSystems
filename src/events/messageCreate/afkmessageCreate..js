const { Message } = require('discord.js');
const afkSchema = require('../../models/afkModel');

/**
 * AFK handler for message interactions.
 * @param {Message} message
 */
module.exports = async function (message) {
  if (message.author.bot) {
    console.log('Message ignored: Sent by a bot.');
    return;
  }

  console.log(`Processing message from ${message.author.username}: "${message.content}"`);

  // Kontrola, jestli je autor zprávy AFK
  const authorAfkData = await afkSchema.findOne({ userId: message.author.id });
  if (authorAfkData) {
    console.log(`${message.author.username} is AFK. Removing AFK status.`);
    await afkSchema.deleteOne({ userId: message.author.id });
    await message.reply({
      content: `Welcome back, ${message.author.username}! Your AFK status has been removed.`,
    });
    console.log(`${message.author.username}'s AFK status removed.`);
  }

  // Zpracování zmínek na AFK uživatele
  if (message.mentions.users.size > 0) {
    console.log(`Message contains mentions: ${[...message.mentions.users.values()].map(u => u.username).join(', ')}`);
    for (const [userId, user] of message.mentions.users) {
      console.log(`Checking if ${user.username} is AFK...`);
      const mentionedUserAfk = await afkSchema.findOne({ userId });
      if (mentionedUserAfk) {
        const afkTime = new Date(mentionedUserAfk.timestamp).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });

        console.log(`${user.username} is AFK with reason: "${mentionedUserAfk.reason || 'No reason provided'}".`);
        
        // Odpovědět uživateli, který pingnul AFK uživatele
        await message.reply({
          content: `${user.username} is currently AFK: "${mentionedUserAfk.reason || 'No reason provided'}". Last active on ${afkTime}.`,
        });
        console.log(`AFK status for ${user.username} notified to ${message.author.username}.`);
      } else {
        console.log(`${user.username} is not AFK.`);
      }
    }
  }
};
