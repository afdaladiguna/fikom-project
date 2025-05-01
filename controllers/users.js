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
    const redirectUrl = res.locals.returnTo || "/projects"; // update this line to use res.locals.returnTo now
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

  // Dapatkan semua assignments yang akan datang (deadline > hari ini)
  const upcomingAssignments = await Assignment.find({
    course: { $in: courses.map((c) => c._id) },
    dueDate: { $gte: new Date() },
  }).populate("course");

  res.render("users/dashboard", { courses, upcomingAssignments });
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
