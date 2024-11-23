const Suggestion = require('../../models/Suggestion');
const formatResults = require('../../utils/formatResults');

module.exports = async (interaction) => {
  if (!interaction.isButton() || !interaction.customId) return;

  try {
    console.log('Interaction started');
    await interaction.deferReply({ ephemeral: true });

    const [type, suggestionId, action] = interaction.customId.split('.');
    if (!type || !suggestionId || !action || type !== 'suggestion') {
      return interaction.editReply({ content: 'Invalid interaction.' });
    }

    console.log('Fetching suggestion from DB...');
    const targetSuggestion = await Suggestion.findOne({ suggestionId });
    if (!targetSuggestion) {
      return interaction.editReply({ content: 'Suggestion not found.' });
    }

    console.log('Fetching target message...');
    const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
    const targetMessageEmbed = targetMessage.embeds[0];

    if (!targetMessageEmbed) {
      console.error('Embed not found in target message');
      return interaction.editReply({ content: 'Embed not found in the target message.' });
    }

    // Handling 'approve' action
    if (action === 'approve') {
      console.log('Processing approval...');
      if (!interaction.member.permissions.has('Administrator')) {
        return interaction.editReply({ content: 'You do not have permission to approve suggestions.' });
      }

      targetSuggestion.status = 'approved';
      targetMessageEmbed.setColor(0x84e668).fields[1].value = '✅ Approved';
      await targetSuggestion.save();
      await targetMessage.edit({ embeds: [targetMessageEmbed] });

      return interaction.editReply({ content: 'Suggestion approved.' });
    }

    // Handling 'reject' action
    if (action === 'reject') {
      console.log('Processing rejection...');
      if (!interaction.member.permissions.has('Administrator')) {
        return interaction.editReply({ content: 'You do not have permission to reject suggestions.' });
      }

      targetSuggestion.status = 'rejected';
      targetMessageEmbed.setColor(0xff6161).fields[1].value = '❌ Rejected';
      await targetSuggestion.save();
      await targetMessage.edit({ embeds: [targetMessageEmbed] });

      return interaction.editReply({ content: 'Suggestion rejected.' });
    }

    // Handling 'upvote' action
    if (action === 'upvote') {
      console.log('Processing upvote...');
      const hasVoted =
        targetSuggestion.upvotes.includes(interaction.user.id) ||
        targetSuggestion.downvotes.includes(interaction.user.id);

      if (hasVoted) {
        return interaction.editReply({ content: 'You have already cast your vote for this suggestion.', ephemeral: true });
      }

      targetSuggestion.upvotes.push(interaction.user.id);
      targetSuggestion.voteCount = targetSuggestion.upvotes.length - targetSuggestion.downvotes.length;
      await targetSuggestion.save();

      targetMessageEmbed.fields[2].value = formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes);
      await targetMessage.edit({ embeds: [targetMessageEmbed] });

      return interaction.editReply({ content: 'Upvoted suggestion.', ephemeral: true });
    }

    // Handling 'downvote' action
    if (action === 'downvote') {
      console.log('Processing downvote...');
      const hasVoted =
        targetSuggestion.upvotes.includes(interaction.user.id) ||
        targetSuggestion.downvotes.includes(interaction.user.id);

      if (hasVoted) {
        return interaction.editReply({ content: 'You have already cast your vote for this suggestion.', ephemeral: true });
      }

      targetSuggestion.downvotes.push(interaction.user.id);
      targetSuggestion.voteCount = targetSuggestion.upvotes.length - targetSuggestion.downvotes.length;
      await targetSuggestion.save();

      targetMessageEmbed.fields[2].value = formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes);
      await targetMessage.edit({ embeds: [targetMessageEmbed] });

      return interaction.editReply({ content: 'Downvoted suggestion.', ephemeral: true });
    }

  } catch (error) {
    console.error('Error in interaction handler:', error);
    await interaction.editReply({ content: 'An error occurred while processing the interaction.' }).catch((err) => {
      console.error('Failed to reply:', err);
    });
  }
};
