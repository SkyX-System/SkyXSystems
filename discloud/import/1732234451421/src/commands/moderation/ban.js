const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a member from this server.")
    .addUserOption(option =>
      option.setName("target-user")
        .setDescription("The user you want to ban.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("The reason you want to ban.")
    ),

    run: async ({ interaction, handler }) => { 
    const targetUser = interaction.options.getUser("target-user");
    const reason = interaction.options.getString("reason") || "The reason was not provided";
  
    await interaction.deferReply({ ephemeral: true }); // Marking the initial reply as ephemeral
  
    try {
      await interaction.guild.members.ban(targetUser.id, { reason });
      await interaction.editReply({
        content: `User ${targetUser.tag} Was banned\nReason: ${reason}`,
        ephemeral: true, // Marking the final reply as ephemeral
      });
    } catch (error) {
      console.error("Error:", error);
      await interaction.editReply({
        content: "There was an error when trying to ban the user.",
        ephemeral: true, // Marking the reply as ephemeral
      });
    }
  },

  options: {
    devOnly: false,
    userPermissions: ["BAN_MEMBERS"],
    botPermissions: ["BAN_MEMBERS"],
    deleted: false,
  },
};
