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

module.exports = router;
