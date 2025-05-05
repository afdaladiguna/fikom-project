const Course = require("../models/course");
const Assignment = require("../models/assignment");
const Project = require("../models/project");

module.exports.renderNewForm = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    req.flash("error", "Mata kuliah tidak ditemukan.");
    return res.redirect("/courses");
  }
  res.render("assignments/new", { course });
};

module.exports.createAssignment = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    req.flash("error", "Mata kuliah tidak ditemukan.");
    return res.redirect("/courses");
  }

  const assignmentData = {
    ...req.body.assignment,
    course: id,
  };

  // Handle file PDF jika ada
  if (req.file) {
    assignmentData.file = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  const assignment = new Assignment(assignmentData);
  await assignment.save();

  course.assignments.push(assignment._id);
  await course.save();

  req.flash("success", "Tugas berhasil ditambahkan!");
  res.redirect(`/courses/${id}`);
};

// module.exports.showAssignment = async (req, res) => {
//   const { id, assignmentId } = req.params;
//   const assignment = await Assignment.findById(assignmentId).populate("course");
//   if (!assignment) {
//     req.flash("error", "Tugas tidak ditemukan.");
//     return res.redirect(`/courses/${id}`);
//   }
//   res.render("assignments/show", { assignment });
// };

module.exports.showAssignment = async (req, res) => {
  const { id, assignmentId } = req.params; // id adalah courseId, assignmentId adalah assignment yang diminta
  const course = await Course.findById(id).populate("assignments");
  const assignment = await Assignment.findById(assignmentId);

  // Mengambil semua proyek yang terkait dengan assignmentId
  const projects = await Project.find({ assignment: assignmentId }).populate("author");

  if (!assignment) {
    req.flash("error", "Tugas tidak ditemukan.");
    return res.redirect("/courses");
  }

  res.render("assignments/show", { course, assignment, projects, currentUser: req.user });
};

module.exports.renderEditForm = async (req, res) => {
  const { id, assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    req.flash("error", "Tugas tidak ditemukan.");
    return res.redirect(`/courses/${id}`);
  }
  res.render("assignments/edit", { courseId: id, assignment });
};

module.exports.updateAssignment = async (req, res) => {
  const { id, assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId);

  // Update basic fields
  assignment.set(req.body.assignment);

  // Ganti file PDF jika ada upload baru
  if (req.file) {
    assignment.file = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await assignment.save();
  req.flash("success", "Tugas berhasil diperbarui.");
  res.redirect(`/courses/${id}`);
};

module.exports.deleteAssignment = async (req, res) => {
  const { id, assignmentId } = req.params;
  await Assignment.findByIdAndDelete(assignmentId);
  req.flash("success", "Tugas berhasil dihapus.");
  res.redirect(`/courses/${id}`);
};
