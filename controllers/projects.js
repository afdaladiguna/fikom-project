/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
const Project = require("../models/project");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const projects = await Project.find({});
  res.render("projects/index", { projects });
};

module.exports.renderNewForm = (req, res) => {
  const { assignment } = req.query; // Extracting 'assignment' from the query string
  res.render("projects/new", { assignmentId: assignment }); // Passing 'assignmentId' to the view
};

module.exports.createProject = async (req, res, next) => {
  const project = new Project(req.body.project);
  project.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  project.author = req.user._id;
  await project.save();
  req.flash("success", "Sukses mengumpulkan tugas!");
  res.redirect(`/projects/${project._id}`);
};

module.exports.showProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("author")
    .populate("assignment")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });

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
  req.flash("success", "Sukses memperbarui tugas!");
  res.redirect(`/projects/${project._id}`);
};

module.exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);
  for (let image of project.images) {
    await cloudinary.uploader.destroy(image.filename);
  }
  req.flash("success", "Sukses menghapus tugas!");
  res.redirect("/projects");
};
