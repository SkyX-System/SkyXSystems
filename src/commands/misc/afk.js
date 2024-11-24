const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const afkSchema = require("../../models/afkModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("afk")
        .setDescription("Set your AFK status")
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for going AFK")
                .setRequired(false)
        ),
    run: async ({ interaction }) => {
        const reason = interaction.options.getString("reason") || "No reason provided";

        // Uložení AFK do MongoDB
        await afkSchema.findOneAndUpdate(
            { userId: interaction.user.id },
            { userId: interaction.user.id, guildId: interaction.guild.id, reason },
            { upsert: true }
        );

        // Odpověď uživateli
        const embed = new EmbedBuilder()
            .setTitle("AFK Status Set")
            .setDescription(`You are now AFK.\n**Reason:** ${reason}`)
            .setColor("Yellow");

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
