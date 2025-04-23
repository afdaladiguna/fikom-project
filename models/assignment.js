const mongoose = require("mongoose");
const { Schema } = mongoose;

const AssignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  type: {
    type: String,
    enum: ["Individual", "Group"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Mid", "Final", "Assignment", "Quiz"],
    required: true,
  },

  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
