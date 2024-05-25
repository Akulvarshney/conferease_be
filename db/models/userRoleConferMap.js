const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  conferenceId: {
    type: Schema.Types.ObjectId,
    ref: "Conference",
    required: true,
  },
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserRole", userRoleSchema);
