const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  roleName: { type: String, required: true },
  miniRoleName: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Role", roleSchema);
