const mongoose = require('mongoose');

const ghostPingSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true },
  logChannelId: { type: String, required: true }, // ID log kanálu
});

const GhostPingSettings = mongoose.model('GhostPingSettings', ghostPingSchema);

module.exports = GhostPingSettings;
