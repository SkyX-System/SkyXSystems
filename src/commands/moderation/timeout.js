const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
  } = require("discord.js");
  const ms = require("ms");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("timeout")
      .setDescription("Timeout a user for a specified duration.")
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user you want to timeout.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("duration")
          .setDescription("Duration of the timeout (e.g., 30m, 1h, 1d).")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for the timeout.")
          .setRequired(false)
      ),
    devOnly: false,
    deleted: false,
    testOnly: false,
  
    run: async ({ interaction }) => {
      const targetUser = interaction.options.getUser("target");
      const duration = interaction.options.getString("duration");
      const reason = interaction.options.getString("reason") || "No reason provided";
  
      await interaction.deferReply({ ephemeral: true });
  
      const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
  
      if (!member) {
        await interaction.editReply("The specified user is not in this server.");
        return;
      }
  
      if (member.user.bot) {
        await interaction.editReply("You cannot timeout a bot.");
        return;
      }
  
      const msDuration = ms(duration);
      if (isNaN(msDuration)) {
        await interaction.editReply("Please provide a valid timeout duration.");
        return;
      }
  
      if (msDuration < 5000 || msDuration > 2.419e9) {
        await interaction.editReply("Timeout duration must be between 5 seconds and 28 days.");
        return;
      }
  
      const requesterRole = interaction.member.roles.highest.position;
      const targetRole = member.roles.highest.position;
      const botRole = interaction.guild.members.me.roles.highest.position;
  
      if (targetRole >= requesterRole) {
        await interaction.editReply("You cannot timeout a user with an equal or higher role than yours.");
        return;
      }
  
      if (targetRole >= botRole) {
        await interaction.editReply("I cannot timeout a user with an equal or higher role than mine.");
        return;
      }
  
      try {
        const isAlreadyTimedOut = member.communicationDisabledUntilTimestamp;
  
        await member.timeout(msDuration, reason);
  
        const timeoutMessage = isAlreadyTimedOut
          ? `${member} already had a timeout. It has been updated to last for ${ms(msDuration, {
              long: true,
            })}.\nReason: ${reason}`
          : `${member} has been timed out for ${ms(msDuration, {
              long: true,
            })}.\nReason: ${reason}`;
  
        const embed = new EmbedBuilder()
          .setTitle("Timeout Applied")
          .setDescription(timeoutMessage)
          .setColor("RED")
          .setTimestamp();
  
        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error("Error applying timeout:", error);
        await interaction.editReply("There was an error applying the timeout.");
      }
    },
  };
  