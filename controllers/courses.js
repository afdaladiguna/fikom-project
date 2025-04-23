const Course = require("../models/course");

module.exports.index = async (req, res) => {
  const courses = await Course.find({ lecturer: req.user._id });
  res.render("courses/index", { courses });
};

module.exports.renderNewForm = (req, res) => {
  res.render("courses/new");
};

module.exports.createCourse = async (req, res) => {
  const course = new Course(req.body.course);
  course.lecturer = req.user._id;
  await course.save();
  req.flash("success", "Mata kuliah berhasil dibuat!");
  res.redirect("/courses");
};

module.exports.showCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).populate("lecturer").populate("assignments"); // <--- ini penting!
  if (!course) {
    req.flash("error", "Mata kuliah tidak ditemukan.");
    return res.redirect("/courses");
  }
  res.render("courses/show", { course });
};

module.exports.renderEditForm = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    req.flash("error", "Mata kuliah tidak ditemukan.");
    return res.redirect("/courses");
  }
  res.render("courses/edit", { course });
};

module.exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndUpdate(id, { ...req.body.course });
  req.flash("success", "Mata kuliah berhasil diperbarui.");
  res.redirect(`/courses/${id}`);
};

module.exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  req.flash("success", "Mata kuliah berhasil dihapus.");
  res.redirect("/courses");
};
