const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a member from this server.")
    .addUserOption(option =>
      option.setName("target-user")
        .setDescription("The user you want to kick.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("The reason you want to kick.")
    ),

  run: async ({ interaction, client, handler }) => {
    const targetUser = interaction.options.getUser("target-user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    await interaction.deferReply();

    try {
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      if (!targetMember) {
        console.error("Target member not found.");
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }

      await targetMember.kick(reason);
      await interaction.editReply(`User ${targetMember.user.tag} was kicked\nReason: ${reason}`);
    } catch (error) {
      console.error("Error:", error);
      await interaction.editReply("There was an error when trying to kick the user.");
    }
  },

  options: {
    devOnly: false,
    userPermissions: ["KICK_MEMBERS"],
    botPermissions: ["KICK_MEMBERS"],
    deleted: false,
  },
};
