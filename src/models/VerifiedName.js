const mongoose = require('mongoose');

const VerifiedNameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('VerifiedName', VerifiedNameSchema);
