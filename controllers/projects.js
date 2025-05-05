/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
const Project = require("../models/project");
const Course = require("../models/course");
const Assignment = require("../models/assignment");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const { keyword, courseId } = req.query;

  let query = {};

  if (keyword) {
    query.$or = [{ title: { $regex: keyword, $options: "i" } }, { description: { $regex: keyword, $options: "i" } }, { category: { $regex: keyword, $options: "i" } }];
  }

  let projects = await Project.find(query).populate("assignment");
  const courses = await Course.find({});

  if (courseId) {
    projects = projects.filter((project) => {
      return project.assignment && project.assignment.course.toString() === courseId;
    });
  }

  res.render("projects/index", { projects, keyword, courseId, courses });
};

module.exports.myProjects = async (req, res) => {
  const projects = await Project.find({ author: req.user._id });
  res.render("projects/my-projects", { projects });
};

module.exports.renderNewForm = (req, res) => {
  res.render("projects/new");
};

module.exports.createProject = async (req, res, next) => {
  const project = new Project(req.body.project);
  project.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  project.author = req.user._id;
  await project.save();
  req.flash("success", "Successfully made a new project!");
  res.redirect(`/projects/${project._id}`);
};

module.exports.showProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate({
      path: "assignment",
      populate: { path: "course" }, // agar bisa akses assignment.course.name
    })
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

  if (!project) {
    req.flash("error", "Cannot find that project!");
    return res.redirect("/projects");
  }
  res.render("projects/show", { project });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    req.flash("error", "Cannot find that project!");
    return res.redirect(`/projects/${id}`);
  }
  res.render("projects/edit", { project });
};

module.exports.updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, {
    ...req.body.project,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  project.images.push(...imgs);
  await project.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await project.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully update project!");
  res.redirect(`/projects/${project._id}`);
};

module.exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);
  for (let image of project.images) {
    await cloudinary.uploader.destroy(image.filename);
  }
  req.flash("success", "Successfully deleted project!");
  res.redirect("/projects");
};

module.exports.giveScore = async (req, res) => {
  const { id } = req.params; // project ID
  const { score, note, courseId, assignmentId } = req.body;

  const project = await Project.findById(id);
  if (!project) {
    req.flash("error", "Project tidak ditemukan.");
    return res.redirect(`/courses/${courseId}/assignments/${assignmentId}`);
  }

  const numericScore = parseInt(score);
  if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
    req.flash("error", "Nilai harus antara 0 dan 100.");
    return res.redirect(`/courses/${courseId}/assignments/${assignmentId}`);
  }

  project.score = numericScore;
  project.note = note || "";
  await project.save();

  req.flash("success", "Nilai dan catatan berhasil diberikan.");
  res.redirect(`/courses/${courseId}/assignments/${assignmentId}`);
};
