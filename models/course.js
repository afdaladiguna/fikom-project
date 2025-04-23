const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new Schema({
  name: String,
  class: String,
  semester: String,
  academicYear: String,
  code: String,
  semester: String,
  description: String,
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
});

module.exports = mongoose.model("Course", CourseSchema);
