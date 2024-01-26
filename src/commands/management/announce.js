const {
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
    ApplicationCommandOptionType,
  } = require("discord.js");
  
  module.exports = {
    deleted: false,
    devOnly: false,
    testOnly: false,
    name: "announce",
    description: "Pošli oznámení",
    options: [
      {
        name: "embed",
        description: "Mám to poslat jako Embed ?",
        type: ApplicationCommandOptionType.Boolean,
        required: true,
      },
      {
        name: "message",
        description: "Napiš co mám poslat jako oznámení",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "channel",
        description: "Do jakého channelu ?",
        type: ApplicationCommandOptionType.Channel,
        required: false,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
  
    async callback(client, interaction) {
      const Message = interaction.options
        .getString("message")
        .replaceAll("+n+", `\n`);
      const channel =
        interaction.options.getChannel("channel") || interaction.channel;
      const boolean = interaction.options.getBoolean("embed");
  
      if (boolean) {
        const embed = new EmbedBuilder();
        await channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("⚠️ OZNÁMENÍ SERVERU ⚠️")
              .setDescription(`${Message}`)
              .setColor("#FF0000")
            //   .setFooter({
            //     text: `autor ${interaction.user.username}`,
            //     iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            //   }),
          ],
        }),
          interaction.reply({
            content: `Embed was created and announcement was sent`,
            ephemeral: true,
          });
      } else {
        await channel.send({
          content: `${Message}`,
        });
  
        interaction.reply({
          content: `Announcement was sent`,
          ephemeral: true,
        });
      }
    },
  };
  
  //https://discord.com/channels/1032785824686817291/1073593931658436658