const GhostPingSettings = require('../../models/GhostPingSettings');

/**
 * Event listener for deleted messages to detect ghost pings.
 * @param {import('discord.js').Message} message
 */
module.exports = async (message) => {
  if (!message.guild) return;  // Ensure it's a message from a guild

  try {
    console.log('Ghost ping detection triggered for message deletion.');
    console.log('Deleted message content:', message.content);
    console.log('Deleted message mentions:', message.mentions.members.size);

    // Retrieve guild settings for ghost ping detection
    const guildSettings = await GhostPingSettings.findOne({ guildId: message.guild.id });
    console.log('Guild settings:', guildSettings);

    // If ghost ping detection is enabled and a log channel is set
    if (guildSettings && guildSettings.enabled && guildSettings.logChannelId) {
      const logChannel = message.guild.channels.cache.get(guildSettings.logChannelId);

      // If the log channel is not found, exit
      if (!logChannel) {
        console.log('Log channel not found.');
        return;
      }

      // Check if the deleted message contains any mentions
      if (message.mentions.members.size > 0) {
        console.log('Ghost ping detected in deleted message.');

        const embed = {
          title: '👻 Ghost Ping Detected!',
          color: 0x1ABC9C,
          fields: [
            { name: '🔹 Author', value: `<@${message.author.id}>`, inline: true },
            { name: '🔹 Content', value: message.content || '(No content)', inline: true },
            { name: '🔹 Mentioned Users', value: message.mentions.members.map(m => m.user.tag).join(', '), inline: true }
          ],
          timestamp: new Date(),
          footer: { text: 'Ghost Ping Logger' }
        };

        // Send the embed to the log channel
        await logChannel.send({ embeds: [embed] });
        console.log('Ghost ping detected and logged.');
      } else {
        console.log('No mentions detected in the deleted message.');
      }
    } else {
      console.log('Ghost ping detection not enabled or log channel not set.');
    }
  } catch (error) {
    console.log(`Error in ghostping.js: ${error}`);
  }
};