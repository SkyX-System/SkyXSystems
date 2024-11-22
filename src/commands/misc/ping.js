const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('pong'),
    run: ({ interaction, client, handler }) => {
        const latency = Date.now() - interaction.createdTimestamp;
        interaction.reply({ content: `Pong! The latency is ${latency} ms`, ephemeral: true });
    },
    options: {
        devOnly: true,
        userPermissions: [''],
        botPermissions: ['BanMembers'],
        deleted: false,
    },
};
