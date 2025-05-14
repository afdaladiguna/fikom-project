const User = require("../models/user");
const Course = require("../models/course");
const Assignment = require("../models/assignment");
const Subject = require("../models/subject");
const Project = require("../models/project");

module.exports.adminDashboard = async (req, res) => {
  const totalCourses = await Course.countDocuments();
  const totalStudents = await User.countDocuments({ role: "mahasiswa" });
  const totalUsers = await User.countDocuments(); // ✅ tambahkan ini
  const totalAssignments = await Assignment.countDocuments();
  const totalProjects = await Project.countDocuments(); // ✅ tambahkan juga kalau ingin pakai di dashboard
  const totalSubjects = await Subject.countDocuments();

  const upcomingAssignments = await Assignment.find({
    dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  })
    .limit(5)
    .sort("dueDate");

  const recentProjects = await Project.find().sort({ submittedAt: -1 }).limit(5).populate("author");

  res.render("admin/admin-dashboard", {
    totalUsers,
    totalCourses,
    totalStudents,
    totalAssignments,
    totalProjects,
    totalSubjects,
    upcomingAssignments,
    recentProjects,
  });
};

module.exports.adminCourseList = async (req, res) => {
  const courses = await Course.find({}).populate("lecturer");
  res.render("admin/course-list", { courses });
};
module.exports.renderEditCourse = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  const subjects = await Subject.find({});
  const lecturers = await User.find({ role: "dosen" });

  if (!course) {
    req.flash("error", "Mata kuliah tidak ditemukan.");
    return res.redirect("/admin/courses");
  }
  res.render("admin/edit-course", { course, lecturers, subjects });
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

module.exports.adminUserList = async (req, res) => {
  const users = await User.find({});
  res.render("admin/user-list", { users });
};

module.exports.resetUserPassword = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "User tidak ditemukan.");
    return res.redirect("/admin/users");
  }

  await user.setPassword(user.username); // set password = username
  await user.save();
  req.flash("success", `Password user ${user.username} telah direset.`);
  res.redirect("/admin/users");
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  req.flash("success", "User berhasil dihapus.");
  res.redirect("/admin/users");
};

module.exports.renderUserForm = (req, res) => {
  res.render("admin/new-user");
};

module.exports.createUser = async (req, res) => {
  try {
    const { username, name, role } = req.body;
    const user = new User({
      username,
      name,
      role,
      actualId: username,
    });
    await User.register(user, username); // password awal = username
    req.flash("success", "User berhasil ditambahkan.");
    res.redirect("/admin/users");
  } catch (e) {
    req.flash("error", "Gagal menambahkan user. Username mungkin sudah terdaftar.");
    res.redirect("/admin/users/new");
  }
};

module.exports.renderNewCourse = async (req, res) => {
  const lecturers = await User.find({ role: "dosen" });
  const subjects = await Subject.find({});

  res.render("admin/new-course", { lecturers, subjects });
};

module.exports.createCourse = async (req, res) => {
  const courseData = req.body.course;
  console.log(courseData);
  const course = new Course(courseData);
  await course.save();
  req.flash("success", "Berhasil menambahkan kelas baru.");
  res.redirect("/admin/courses");
};

module.exports.adminSubjectList = async (req, res) => {
  const subjects = await Subject.find({});
  res.render("admin/subject-list", { subjects });
};

module.exports.renderNewSubject = (req, res) => {
  res.render("admin/new-subject");
};

module.exports.createSubject = async (req, res) => {
  const { name, code } = req.body.subject;
  const newSubject = new Subject({ name, code });
  await newSubject.save();
  req.flash("success", "Subject berhasil ditambahkan.");
  res.redirect("/admin/subjects");
};

module.exports.renderEditSubject = async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findById(id);
  if (!subject) {
    req.flash("error", "Subject tidak ditemukan.");
    return res.redirect("/admin/subjects");
  }
  res.render("admin/edit-subject", { subject });
};

module.exports.updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body.subject;
  await Subject.findByIdAndUpdate(id, { name, code });
  req.flash("success", "Subject berhasil diperbarui.");
  res.redirect("/admin/subjects");
};

module.exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  await Subject.findByIdAndDelete(id);
  req.flash("success", "Subject berhasil dihapus.");
  res.redirect("/admin/subjects");
};

// Menampilkan daftar semua project mahasiswa
module.exports.adminProjectList = async (req, res) => {
  const projects = await Project.find({}).populate("author").populate("assignment"); // author = mahasiswa
  res.render("admin/project-list", { projects });
};

// Menghapus project tertentu
module.exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  req.flash("success", "Project berhasil dihapus.");
  res.redirect("/admin/projects");
};
