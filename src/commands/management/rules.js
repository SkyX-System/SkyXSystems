const {
    Client,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  
  module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    permissionsRequired: [PermissionFlagsBits.Administrator],
  
    callback: async (client, interaction) => {
      const embed = new EmbedBuilder()
        .setTitle("**Welcome to the official server of SkyX System**")
        .setAuthor({
          name: "SkyX System",
          iconURL:
            "https://cdn.discordapp.com/avatars/467393849182912526/251fb29dec388516a5923e588701baaa.webp",
        })
        .setFooter({
          text: "This server is in compliance with the Discord Terms of Service which can be found at the following link: https://discord.com/terms",
          iconURL:
            "https://cdn.discordapp.com/avatars/467393849182912526/251fb29dec388516a5923e588701baaa.webp",
        })
        .setTimestamp()
        .setColor("White")
        .addFields(
          {
            name: "Please follow basic rules of etiquette.",
            value: "\u200B",
            inline: false,
          },
          {
            name: "The management of this server reserves all rights.",
            value: "\u200B",
            inline: false,
          },
          {
            name: "Provoking, insulting, using profanity or making derogatory comments, and starting arguments are prohibited. There is ZERO tolerance for bullying here.",
            value: "\u200B",
            inline: false,
          },
          {
            name: "Expressions of racism, xenophobia, Nazism, homophobia, or extremist views are prohibited.",
            value: "\u200B",
            inline: false,
          },
          {
            name: "Sending any links or files that are harmful or inappropriate is prohibited.",
            value: "\u200B",
            inline: false,
          },
          {
            name: `Any type of spam or flooding is prohibited - more than 3 identical messages in a row are considered spam.`,
            value: "\u200B",
          },
          {
            name: `Posting links redirecting to gifts, harmful content, adult content, or derogatory content is FORBIDDEN.`,
            value: "\u200B",
          },
          {
            name: `No nudity. Do not post any images with sexual undertones or nudity in the chats.`,
            value: "\u200B",
          },
          {
            name: `Rules may change at any time. All members will be properly informed of these changes.`,
            value: "\u200B",
          }
        );
  
      interaction.reply({ embeds: [embed] });
    },
    name: "rules",
    description: "Writes the server rules.",
    deleted: false,
    testServer: true,
    devOnly: true,
  };