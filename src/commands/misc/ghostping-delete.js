const { SlashCommandBuilder } = require('discord.js');
const GhostPing = require('../../models/GhostPingSettings');  // Stejně jako výše pro odstranění.

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ghostping-delete')
    .setDescription('Disable ghost ping detection on the server.'),
  
  run: async ({ interaction, client }) => {
    // Smazání záznamu v databázi, pokud uživatel deaktivuje ghostping
    await GhostPing.deleteOne({ guildId: interaction.guild.id });

    await interaction.reply('Ghost ping detection has been disabled on this server.');
  },

  options: {
    devOnly: true,
    userPermissions: [''],
    botPermissions: ['BanMembers'],
    deleted: false,
},
};
