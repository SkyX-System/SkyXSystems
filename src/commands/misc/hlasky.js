const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('legendaryquote')
    .setDescription('Vytvoří embed s legendární hláškou a aktivuje funkci pro zpracování zpráv.'),

  async run(interaction, client) {
    try {
      // Check for channel context (already present)
      if (!interaction.channel) {
        console.error('interaction.channel is undefined. This command cannot be used in DMs.');
        await interaction.reply({ content: 'Tento příkaz nelze použít v soukromých zprávách.', ephemeral: true });
        return;
      }

      // Defer the interaction
      await interaction.deferReply();

      // Initial embed and message sending
      const initialLegendaryQuoteEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Legendární hláška')
        .setDescription('Zde se zobrazí zpráva uživatele.')
        .setFooter({ text: 'Čeká na legendární hlášku...' });

      const legendaryQuoteMessage = await interaction.channel.send({ embeds: [initialLegendaryQuoteEmbed] });

      // Acknowledge the interaction with editReply
      await interaction.editReply({ content: 'Počkej na další pokyny...', ephemeral: true });

      // ... Rest of the code for message listener and embed update remains the same ...
    } catch (error) {
      console.error('Nastala chyba:', error);
    }
  },
};
