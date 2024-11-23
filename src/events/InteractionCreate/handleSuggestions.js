const { Interaction } = require('discord.js');
const Suggestion = require('../../models/Suggestion');
const formatResults = require('../../utils/formatResults');

/**
 *
 * @param {Interaction} interaction
 */
module.exports = async (interaction) => {
  if (!interaction.isButton() || !interaction.customId) return;

  try {
    const [type, suggestionId, action] = interaction.customId.split('.');

    if (!type || !suggestionId || !action) return;
    if (type !== 'suggestion') return;

    await interaction.deferReply({ ephemeral: true });

    // Hledání návrhu v databázi
    const targetSuggestion = await Suggestion.findOne({ suggestionId });

    // Pokud návrh není nalezen
    if (!targetSuggestion) {
      await interaction.editReply('Suggestion not found.');
      return;
    }

    // Pokud chybí messageId
    if (!targetSuggestion.messageId) {
      await interaction.editReply('Suggestion message ID is missing.');
      return;
    }

    // Získání zprávy podle messageId
    const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);

    // Získání embedu zprávy
    const targetMessageEmbed = targetMessage.embeds[0];

    // Akce pro schválení návrhu
    if (action === 'approve') {
      if (!interaction.memberPermissions.has('Administrator')) {
        await interaction.editReply('You do not have permission to approve suggestions.');
        return;
      }

      targetSuggestion.status = 'approved';
      targetMessageEmbed.data.color = 0x84e660; // Zelená barva
      targetMessageEmbed.fields[1].value = '✅ Approved';

      await targetSuggestion.save();
      await interaction.editReply('Suggestion approved!');

      targetMessage.edit({
        embeds: [targetMessageEmbed],
        components: [targetMessage.components[0]],
      });
      return;
    }

    // Akce pro zamítnutí návrhu
    if (action === 'reject') {
      if (!interaction.memberPermissions.has('Administrator')) {
        await interaction.editReply('You do not have permission to reject suggestions.');
        return;
      }

      targetSuggestion.status = 'rejected';
      targetMessageEmbed.data.color = 0xff6161; // Červená barva
      targetMessageEmbed.fields[1].value = '❌ Rejected';

      await targetSuggestion.save();
      await interaction.editReply('Suggestion rejected!');

      targetMessage.edit({
        embeds: [targetMessageEmbed],
        components: [targetMessage.components[0]],
      });
      return;
    }

    // Akce pro hlasování "upvote"
    if (action === 'upvote') {
      const hasVoted =
        targetSuggestion.upvotes.includes(interaction.user.id) ||
        targetSuggestion.downvotes.includes(interaction.user.id);

      if (hasVoted) {
        await interaction.editReply('You have already casted your vote for this suggestion.');
        return;
      }

      targetSuggestion.upvotes.push(interaction.user.id);
      await targetSuggestion.save();

      interaction.editReply('Upvoted suggestion!');

      targetMessageEmbed.fields[2].value = formatResults(
        targetSuggestion.upvotes,
        targetSuggestion.downvotes
      );

      targetMessage.edit({
        embeds: [targetMessageEmbed],
      });
      return;
    }

    // Akce pro hlasování "downvote"
    if (action === 'downvote') {
      const hasVoted =
        targetSuggestion.upvotes.includes(interaction.user.id) ||
        targetSuggestion.downvotes.includes(interaction.user.id);

      if (hasVoted) {
        await interaction.editReply('You have already casted your vote for this suggestion.');
        return;
      }

      targetSuggestion.downvotes.push(interaction.user.id);
      await targetSuggestion.save();

      interaction.editReply('Downvoted suggestion!');

      targetMessageEmbed.fields[2].value = formatResults(
        targetSuggestion.upvotes,
        targetSuggestion.downvotes
      );

      targetMessage.edit({
        embeds: [targetMessageEmbed],
      });
      return;
    }
  } catch (error) {
    console.log(`Error in handleSuggestion.js: ${error}`);
    await interaction.editReply('An error occurred while processing your request.');
  }
};
