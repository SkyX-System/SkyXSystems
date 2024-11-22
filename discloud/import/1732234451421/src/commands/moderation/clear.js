const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears a specified number of messages.")
    .addIntegerOption(option =>
      option.setName("amount")
        .setDescription("The number of messages to clear.")
        .setRequired(true)
    ),

  run: async ({ interaction, client, handler }) => {
    const amount = interaction.options.getInteger("amount");

    try {
      await interaction.deferReply({ ephemeral: true, timeout: 60000 }); // Set the timeout to 60 seconds

      const messages = await interaction.channel.messages.fetch({ limit: amount });

      const oldestMessage = messages.last();
      const ageInDays = (Date.now() - oldestMessage.createdTimestamp) / (1000 * 60 * 60 * 24);

      if (ageInDays > 14) {
        await interaction.editReply({
          content: "You can only delete messages that are under 14 days old. `This is because of Discord API`"
        });
      } else {
        await interaction.channel.bulkDelete(messages);
        await interaction.editReply({
          content: `Successfully cleared ${messages.size} messages.`
        });
      }
    } catch (error) {
      console.error("Error:", error);
      await interaction.followUp({
        content: "There was an error when trying to clear messages.",
        ephemeral: true, // Marking the reply as ephemeral
      });
    }
  },

  options: {
    devOnly: false,
    userPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["MANAGE_MESSAGES"],
    deleted: false,
  },
};
