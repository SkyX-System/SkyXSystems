const Suggestion = require('../../models/Suggestion');
const { Interaction } = require('discord.js');
const formatResults = require('../../utils/formatResults');

module.exports = async (interaction) => {
  if (!interaction.isButton() || !interaction.customId) return;

  try {
    const [type, suggestionId, action] = interaction.customId.split('.');

    if (!type || !suggestionId || !action) return;
    if (type !== 'suggestion') return;

    const targetSuggestion = await Suggestion.findOne({ suggestionId});
    const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
    const targetMessageEmbed = targetMessage.embeds[0];

    await interaction.deferReply();

    if (action === 'approve') {
      if (!interaction.memberPermissions.has('Administrator')) {
        await interaction.editReply('You do not have permission to approve suggestions.');
        return;
      }
      targetSuggestion.status = 'approved';

      if (targetMessageEmbed.fields && targetMessageEmbed.fields[1]) {
        targetMessageEmbed.data.color = 0x84e668;
        targetMessageEmbed.fields[1].value = '✅ Approved';
      } else {
        console.log('Error: fields[1] is undefined or empty');
      }

      await targetSuggestion.save();
      interaction.editReply('Suggestion approved');

      console.log(formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes));

      targetMessage.edit({
        embeds: [targetMessageEmbed],
        components: [targetMessage.components[0]],
      });

      return;
    }

    if (action === 'reject') {
      if (!interaction.memberPermissions.has('Administrator')) {
        await interaction.editReply('You do not have permission to approve suggestions.');
        return;
      }
      targetSuggestion.status = 'rejected';

      if (targetMessageEmbed.fields && targetMessageEmbed.fields[1]) {
        targetMessageEmbed.data.color = 0xff6161;
        targetMessageEmbed.fields[1].value = '❌ Rejected';
      } else {
        console.log('Error: fields[1] is undefined or empty');
      }

      await targetSuggestion.save();
      interaction.editReply('Suggestion rejected!');

      console.log(formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes));

      targetMessage.edit({
        embeds: [targetMessageEmbed],
        components: [targetMessage.components[0]],
      });

      return;
    }

    if (action === 'upvote') {
      const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);
    
      // if (hasVoted) {
      //   await interaction.editReply('You have already casted your vote for this suggestion', { ephemeral: true});
      //   return;
      // }
    
      targetSuggestion.upvotes.push(interaction.user.id);
      targetSuggestion.voteCount = targetSuggestion.upvotes.length - targetSuggestion.downvotes.length;
      await targetSuggestion.save();
      interaction.editReply('Upvoted suggestion', { ephemeral: true});
      console.log(`Upvotes: ${targetSuggestion.upvotes.length}`);
    
      targetMessageEmbed.fields[2].value = formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes);
    
      console.log(formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes));
    
      targetMessage.edit({ embeds: [targetMessageEmbed] });
      return;
    }
    
    if (action === 'downvote') {
      const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);
    
      // if (hasVoted) {
      //   await interaction.editReply('You have already casted your vote for this suggestion', { ephemeral: true});
      //   return;
      // }
    
      targetSuggestion.downvotes.push(interaction.user.id);
      targetSuggestion.voteCount = targetSuggestion.upvotes.length - targetSuggestion.downvotes.length;
      await targetSuggestion.save();
      interaction.editReply('Downvoted suggestion', { ephemeral: true});
    
      targetMessageEmbed.fields[2].value = formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes);
    
      console.log(formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes));
    
      targetMessage.edit({ embeds: [targetMessageEmbed] });
      return;
    }
  } catch (error) {
    console.log(`Error in handleSuggestion.js ${error}`);
  }
};