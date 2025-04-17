const Assignment = require("../models/assignment");
const Project = require("../models/project");

module.exports.index = async (req, res) => {
  const assignments = await Assignment.find({}).populate("createdBy");
  res.render("assignments/index", { assignments });
};

module.exports.renderNewForm = (req, res) => {
  res.render("assignments/new");
};

module.exports.showAssignment = async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id).populate("createdBy");
  const submissions = await Project.find({ assignment: id }).populate("author");
  res.render("assignments/show", { assignment, submissions });
};

module.exports.createAssignment = async (req, res) => {
  const { title, subject, description, deadline } = req.body;
  const assignment = new Assignment({
    title,
    subject,
    description,
    deadline,
    createdBy: req.user._id,
  });

  await assignment.save();
  req.flash("success", "Tugas berhasil dibuat.");
  res.redirect("/assignments");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id);
  if (!assignment) {
    req.flash("error", "Assignment tidak ditemukan.");
    return res.redirect("/assignments");
  }
  res.render("assignments/edit", { assignment });
};

module.exports.updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { title, subject, description, deadline } = req.body;

  const assignment = await Assignment.findByIdAndUpdate(id, {
    title,
    subject,
    description,
    deadline,
  });

  req.flash("success", "Assignment berhasil diperbarui.");
  res.redirect(`/assignments/${assignment._id}`);
};

module.exports.deleteAssignment = async (req, res) => {
  const { id } = req.params;
  await Assignment.findByIdAndDelete(id);
  req.flash("success", "Assignment berhasil dihapus.");
  res.redirect("/assignments");
};

module.exports.giveScore = async (req, res) => {
  const { assignmentId, projectId } = req.params;
  const { score } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    req.flash("error", "Proyek tidak ditemukan.");
    return res.redirect("/assignments");
  }

  project.score = score;
  await project.save();

  req.flash("success", "Nilai berhasil diberikan.");
  res.redirect(`/assignments/${assignmentId}`);
};
