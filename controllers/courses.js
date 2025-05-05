const Course = require("../models/course");
const Subject = require("../models/subject");

module.exports.index = async (req, res) => {
  const courses = await Course.find().populate("lecturer");
  res.render("courses/index", { courses });
};

module.exports.myCourses = async (req, res) => {
  const userId = req.user._id;
  const courses = await Course.find({ students: userId }).populate("lecturer");
  res.render("courses/my-courses", { courses });
};

module.exports.renderNewForm = async (req, res) => {
  const subjects = await Subject.find({});
  res.render("courses/new", { subjects });
};

module.exports.createCourse = async (req, res) => {
  const course = new Course(req.body.course);
  course.lecturer = req.user._id;
  await course.save();
  req.flash("success", "Mata kuliah berhasil dibuat!");
  res.redirect("/dashboard");
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

module.exports.enroll = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  // Cek apakah user sudah terdaftar
  const alreadyEnrolled = course.students.includes(req.user._id);
  if (alreadyEnrolled) {
    req.flash("info", "Kamu sudah terdaftar di mata kuliah ini.");
    return res.redirect("/courses");
  }

  // Enroll user
  course.students.push(req.user._id);
  await course.save();
  req.flash("success", "Berhasil mendaftar ke mata kuliah.");
  res.redirect("/courses");
};
