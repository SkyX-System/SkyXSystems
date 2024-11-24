const mongoose = require('mongoose');

const ghostPingSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  logChannelId: { type: String, required: true }
});

module.exports = mongoose.model('GhostPingSettings', ghostPingSchema);
