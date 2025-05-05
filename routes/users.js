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

module.exports = router;
