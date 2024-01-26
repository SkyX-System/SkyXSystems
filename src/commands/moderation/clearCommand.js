const {
    Client,
    Interaction,
    Options,
    PermissionFlagsBits,
  } = require("discord.js");
  
  module.exports = {
    deleted: false,
    // devOnly: false,
    // testOnly: false,
    name: "clear",
    description: "Smaže specifické číslo zpráv",
    type: "CHAT_INPUT",
    options: [
      {
        name: "number",
        description: "Number of messages to delete",
        type: 4,
        required: true,
      },
    ],
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    permissionsRequired: [PermissionFlagsBits.MANAGE_MESSAGES],
    callback: async (client, interaction) => {
      try {
        await interaction.deferReply().catch((err) => {});
  
        const amount =
          interaction.options._hoistedOptions.find((f) => f.name === "number")
            .value + 1;
  
        if (isNaN(amount) || amount < 1 || amount > 100) {
          return interaction.editReply({
            content:
              "Prosím napiš číslo mezi 1 až 100, aby jsem zprávy mohl smazat.",
          });
        }
  
        await interaction.editReply({
          content: `Úspěšně smazáno ${amount} zpráv :broom:`,
        });
        await interaction.channel.bulkDelete(amount, true);
      } catch (err) {
        console.log("something went wrong =>", err);
        await interaction.editReply({
          content: "Nepodařilo se smazat zprávy.",
          ephemeral: true,
        });
      }
    },
  };