const mongoose = require("mongoose");
const { Schema } = mongoose;

const FileSchema = new Schema({
  url: String,
  filename: String,
});

const AssignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  type: {
    type: String,
    enum: ["Individual", "Group"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Mid", "Final", "Assignment"],
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  file: FileSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
