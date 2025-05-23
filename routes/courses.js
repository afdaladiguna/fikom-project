const express = require("express");
const router = express.Router();
const courses = require("../controllers/courses");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isLecturer } = require("../middleware");

router.route("/").get(catchAsync(courses.index)).post(isLoggedIn, catchAsync(courses.createCourse));

router.get("/new", isLoggedIn, courses.renderNewForm);

router.get("/my-courses", isLoggedIn, catchAsync(courses.myCourses));

router.route("/:id").get(isLoggedIn, catchAsync(courses.showCourse)).put(isLoggedIn, catchAsync(courses.updateCourse)).delete(isLoggedIn, catchAsync(courses.deleteCourse));

router.get("/:id/edit", isLoggedIn, catchAsync(courses.renderEditForm));

router.post("/:id/enroll", isLoggedIn, courses.enroll);

module.exports = router;
