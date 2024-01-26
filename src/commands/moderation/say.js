const {
  Client,
  Interaction,
  Options,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  devOnly: false,
  deleted: false,
  testOnly: false,
  name: "say",
  description: "Says what said to say",
  type: "CHAT_INPUT",
  options: [
    {
      name: "text",
      description: "what to say",
      type: 3,
      required: true,
    },
  ],
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply().catch((err) => {});

      const whatToSay = interaction.options._hoistedOptions.find(
        (f) => f.name === "text"
      ).value;

      await interaction.editReply({ content: "Sending ..." });
      await interaction.deleteReply();

      await interaction.channel.send({ content: whatToSay });
    } catch (err) {
      console.log("something went wrong =>", err);
    }
  },
};