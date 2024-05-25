const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  conferenceId: {
    type: Schema.Types.ObjectId,
    ref: "Conference",
    required: true,
  },
  title: { type: String, required: true },
  abstract: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
