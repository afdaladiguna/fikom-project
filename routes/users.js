const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const { isLoggedIn, isLecturer, storeReturnTo, isAdmin } = require("../middleware");

router.route("/register").get(users.renderRegister).post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      // logs the user in and clears req.session
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login // res.locals.returnTo to redirect the user after login
  );

router.get("/logout", users.logout);

router.get("/dashboard", isLoggedIn, isLecturer, users.lecturerDashboard);

router.get("/admin/dashboard", isLoggedIn, isAdmin, users.adminDashboard);
router.get("/admin/courses", isLoggedIn, isAdmin, catchAsync(users.adminCourseList));
router.get("/admin/courses/:id/edit", isLoggedIn, isAdmin, catchAsync(users.renderEditCourse));
router.put("/admin/courses/:id", isLoggedIn, isAdmin, catchAsync(users.updateCourse));
router.delete("/admin/courses/:id", isLoggedIn, isAdmin, catchAsync(users.deleteCourse));
router.get("/admin/courses/new", isLoggedIn, isAdmin, catchAsync(users.renderNewCourse));
router.post("/admin/courses", isLoggedIn, isAdmin, catchAsync(users.createCourse));

router.get("/admin/users", isLoggedIn, isAdmin, catchAsync(users.adminUserList));
router.post("/admin/users/:id/reset", isLoggedIn, isAdmin, catchAsync(users.resetUserPassword));
router.delete("/admin/users/:id", isLoggedIn, isAdmin, catchAsync(users.deleteUser));
router.get("/admin/users/new", isLoggedIn, isAdmin, users.renderUserForm);
router.post("/admin/users", isLoggedIn, isAdmin, catchAsync(users.createUser));

// SUBJECT MANAGEMENT
router.get("/admin/subjects", isLoggedIn, isAdmin, catchAsync(users.adminSubjectList));
router.get("/admin/subjects/new", isLoggedIn, isAdmin, users.renderNewSubject);
router.post("/admin/subjects", isLoggedIn, isAdmin, catchAsync(users.createSubject));
router.get("/admin/subjects/:id/edit", isLoggedIn, isAdmin, catchAsync(users.renderEditSubject));
router.put("/admin/subjects/:id", isLoggedIn, isAdmin, catchAsync(users.updateSubject));
router.delete("/admin/subjects/:id", isLoggedIn, isAdmin, catchAsync(users.deleteSubject));

// PROJECT MANAGEMENT
router.get("/admin/projects", isLoggedIn, isAdmin, catchAsync(users.adminProjectList));
router.delete("/admin/projects/:id", isLoggedIn, isAdmin, catchAsync(users.deleteProject));

module.exports = router;
