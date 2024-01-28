module.exports = {
    name: "avatar",
    deleted: false,
    devOnly: false,
    testOnly: false,
    description: "Get the avatar URL of the selected user, or your own avatar.",
    options: [
      {
        name: "target",
        description: "The user's avatar to show",
        type: 6,
      },
    ],
    callback: async (client, interaction) => {
      const user = interaction.options.getUser("target");
      if (user)
        return interaction.reply(
          `${user.username}'s avatar: ${user.displayAvatarURL()}`
        );
      return interaction.reply(
        `Your avatar: ${interaction.user.displayAvatarURL()}`
      );
    },
  };
  