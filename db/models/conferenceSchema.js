const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conferenceSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conference", conferenceSchema);
