const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addemoji')
    .setDescription('Adds an emoji to the server')
    .addAttachmentOption(option => option.setName('emoji').setDescription('The emoji you want to add to the server').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('The name of the emoji').setRequired(true)),

  run: async ({ interaction, client, handler, }) => {
    const { member } = interaction;

    if (!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return await interaction.reply({ content: '⚠️ You do not have permission to add emojis here. ⚠️', ephemeral: true });
    }

    const upload = interaction.options.getAttachment('emoji');
    const name = interaction.options.getString('name');

    await interaction.reply({ content: '🔄 Loading your emoji...', ephemeral: true });

    try {
      const emoji = await interaction.guild.emojis.create({ attachment: upload.attachment, name: `${name}` });

      setTimeout(() => {
        const embed = new EmbedBuilder()
          .setColor('Red')
          .setDescription(`✅ Your emoji has been added: ${emoji}`);

        interaction.editReply({ content: '', embeds: [embed] });
      }, 3000);
    } catch (err) {
      setTimeout(() => {
        console.log(err);
        return interaction.editReply({ content: err.rawError.message });
      }, 2000);
    }
  },

  options: {
    devOnly: false,
    userPermissions: ['ManageRoles'],
    botPermissions: ['Administrator'],
    deleted: false,
  },
};