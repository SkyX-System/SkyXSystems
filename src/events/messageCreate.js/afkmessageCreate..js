const afkSchema = require("../../models/afkModel");

module.exports = async (message, client) => {
    // Ignoruj zprávy botů
    if (message.author.bot) return;

    // Zkontroluj, zda má uživatel AFK status
    const afkData = await afkSchema.findOne({ userId: message.author.id });
    console.log(afkData);

    if (afkData) {
        // Odstraň AFK z databáze
        await afkSchema.deleteOne({ userId: message.author.id });

        // Informuj uživatele
        await message.reply(
        "Welcome back, ${message.author.username}! Your AFK status has been removed."
        );
        return;
    }
};
