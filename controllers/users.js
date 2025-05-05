const User = require("../models/user");
const Course = require("../models/course");
const Assignment = require("../models/assignment");
const Project = require("../models/project");

module.exports.renderRegister = (req, res) => {
  res.render("./users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    const user = new User({
      username, // diisi NIM
      actualId: username, // untuk keperluan tampilan atau kebutuhan lain
      name,
      role: "mahasiswa",
    });
    await User.register(user, password);
    req.flash("success", "Registrasi berhasil! Silahkan login.");
    res.redirect("/login");
  } catch (e) {
    req.flash("error", "NIM sudah terdaftar.");
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("./users/login");
};

module.exports.login = (req, res) => {
  try {
    req.flash("success", "Berhasil login.");

    const user = req.user; // Berisi data user yang baru saja login

    let redirectUrl = "/projects"; // fallback

    if (user.role === "dosen") {
      redirectUrl = "/dashboard";
    } else if (user.role === "admin") {
      redirectUrl = "/admin/dashboard";
    } else if (user.role === "mahasiswa") {
      redirectUrl = "/courses";
    }

    res.redirect(redirectUrl);
  } catch (e) {
    req.flash("error", "NIM belum terdaftar atau password salah.");
    res.redirect("/login");
  }
};

module.exports.logout = (req, res, next) => {
  // eslint-disable-next-line prefer-arrow-callback, func-names
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Berhasil logout.");
    res.redirect("/");
  });
};

module.exports.lecturerDashboard = async (req, res) => {
  const lecturerId = req.user._id;

  const courses = await Course.find({ lecturer: lecturerId }).populate("students").populate("assignments");

  const upcomingAssignments = await Assignment.find({
    course: { $in: courses.map((c) => c._id) },
    dueDate: { $gte: new Date() },
  }).populate("course");

  res.render("users/dashboard", { user: req.user, courses, upcomingAssignments });
};

module.exports.adminDashboard = async (req, res) => {
  const totalCourses = await Course.countDocuments();
  const totalStudents = await User.countDocuments({ role: "mahasiswa" });
  const totalAssignments = await Assignment.countDocuments();

  const upcomingAssignments = await Assignment.find({
    dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  })
    .limit(5)
    .sort("dueDate");

  const recentProjects = await Project.find().sort({ submittedAt: -1 }).limit(5).populate("author");

  res.render("users/adminDashboard", {
    totalCourses,
    totalStudents,
    totalAssignments,
    upcomingAssignments,
    recentProjects,
  });
};

module.exports.adminCourseList = async (req, res) => {
  const courses = await Course.find({});
  res.render("admin/course-list", { courses });
};
module.exports.renderEditCourse = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    req.flash("error", "Mata kuliah tidak ditemukan.");
    return res.redirect("/admin/courses");
  }
  res.render("admin/edit-course", { course });
};

module.exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body.course;
  await Course.findByIdAndUpdate(id, { name, description });
  req.flash("success", "Berhasil mengupdate mata kuliah.");
  res.redirect("/admin/courses");
};

module.exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  req.flash("success", "Berhasil menghapus mata kuliah.");
  res.redirect("/admin/courses");
};
