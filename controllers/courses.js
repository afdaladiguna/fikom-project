const Course = require("../models/course");
const Subject = require("../models/subject");

module.exports.index = async (req, res) => {
  const { keyword } = req.query;
  const regex = keyword ? new RegExp(keyword, "i") : null;

  // Ambil semua course + dosennya
  let courses = await Course.find().populate("lecturer");

  // Jika ada keyword, lakukan filter manual
  if (regex) {
    courses = courses.filter((course) => {
      return regex.test(course.name) || regex.test(course.code) || regex.test(course.class) || regex.test(course.description) || regex.test(course.lecturer?.name || "");
    });
  }

  res.render("courses/index", {
    courses,
    keyword,
  });
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
  req.flash("success", "Kelas berhasil dibuat!");
  res.redirect("/dashboard");
};

module.exports.showCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).populate("lecturer").populate("assignments"); // <--- ini penting!
  if (!course) {
    req.flash("error", "Kelas tidak ditemukan.");
    return res.redirect("/courses");
  }
  res.render("courses/show", { course });
};

module.exports.renderEditForm = async (req, res) => {
  const course = await Course.findById(req.params.id);
  const subjects = await Subject.find({});
  if (!course) {
    req.flash("error", "Kelas tidak ditemukan.");
    return res.redirect("/courses");
  }
  res.render("courses/edit", { course, subjects });
};

module.exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndUpdate(id, { ...req.body.course });
  req.flash("success", "Kelas berhasil diperbarui.");
  res.redirect(`/courses/${id}`);
};

module.exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  req.flash("success", "Kelas berhasil dihapus.");
  res.redirect("/courses");
};

module.exports.enroll = async (req, res) => {
  const { id } = req.params;
  const { enrollKey } = req.body; // Ambil enrollKey dari body permintaan

  const course = await Course.findById(id);

  // Cek apakah course ditemukan
  if (!course) {
    // Mengirimkan JSON response untuk JavaScript
    return res.json({ success: false, message: "Kelas tidak ditemukan." });
  }

  // Cek apakah user sudah terdaftar
  const alreadyEnrolled = course.students.includes(req.user._id);
  if (alreadyEnrolled) {
    return res.json({ success: false, message: "Kamu sudah enroll di kelas ini." });
  }

  // Bandingkan enroll key
  if (course.enrollKey !== enrollKey) {
    return res.json({ success: false, message: "Enroll key salah." });
  }

  // Enroll user
  course.students.push(req.user._id);
  await course.save();

  // Mengirimkan JSON response untuk JavaScript
  return res.json({ success: true, message: "Berhasil enroll kelas." });
};
