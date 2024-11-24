const { Schema, model } = require("mongoose");

const afkSchema = new Schema({
    userId: { type: String, required: true }, // ID uživatele
    guildId: { type: String, required: true }, // ID serveru
    reason: { type: String, default: "No reason provided" }, // Důvod AFK
});

module.exports = model("AFK", afkSchema);
