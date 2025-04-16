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

module.exports.giveScore = async (req, res) => {
  const { projectId } = req.params;
  const { score } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    req.flash("error", "Proyek tidak ditemukan.");
    return res.redirect("back");
  }

  project.score = score;
  await project.save();

  req.flash("success", "Nilai berhasil diberikan.");
  res.redirect("back");
};
