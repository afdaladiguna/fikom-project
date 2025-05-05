const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  semester: { type: String, required: true },
  academicYear: { type: String, required: true },
  code: { type: String, required: true },
  semester: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lecturer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  assignments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Course", CourseSchema);
