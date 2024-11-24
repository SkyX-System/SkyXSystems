const { SlashCommandBuilder } = require('discord.js');
const GhostPing = require('../../models/GhostPingSettings');  // Mělo by to být ve tvém modelu pro uložení dat o GhostPing.

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ghostping-setup')
    .setDescription('Enable ghost ping detection on the server.')
    .addChannelOption(option =>
      option.setName('log-channel')
        .setDescription('The channel where ghost ping logs will be sent')
        .setRequired(true)
    ),
  
  run: async ({ interaction, client }) => {
    const logChannel = interaction.options.getChannel('log-channel');
    
    // Uložit informace o log kanálu do databáze nebo konfiguračního souboru
    await GhostPing.updateOne(
      { guildId: interaction.guild.id },
      { logChannelId: logChannel.id },
      { upsert: true }
    );
  
    await interaction.reply(`Ghost ping detection has been enabled. All logs will be sent to ${logChannel}.`);
  },

  options: {
    devOnly: true,
    userPermissions: [''],
    botPermissions: ['BanMembers'],
    deleted: false,
},
};
