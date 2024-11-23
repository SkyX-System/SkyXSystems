const { ActivityType } = require("discord.js");

module.exports = (c, client, handler) => {
    console.log(`🛜  ${client.user.tag} is online 🛜`);

    client.user.setActivity({
        name: 'SkyX Systems',
        type: ActivityType.Watching,
        url: 'https://skyxsystems.discloud.app'
    })
};