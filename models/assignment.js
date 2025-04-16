const mongoose = require("mongoose");
const { Schema } = mongoose;

const assignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },

  description: String,
  deadline: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User", // dosen
  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
