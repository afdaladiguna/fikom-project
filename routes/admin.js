const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const admin = require("../controllers/admin");
const { isLoggedIn, isAdmin } = require("../middleware");

router.get("/dashboard", isLoggedIn, isAdmin, admin.adminDashboard);
router.get("/courses", isLoggedIn, isAdmin, catchAsync(admin.adminCourseList));
router.get("/courses/:id/edit", isLoggedIn, isAdmin, catchAsync(admin.renderEditCourse));
router.put("/courses/:id", isLoggedIn, isAdmin, catchAsync(admin.updateCourse));
router.delete("/courses/:id", isLoggedIn, isAdmin, catchAsync(admin.deleteCourse));
router.get("/courses/new", isLoggedIn, isAdmin, catchAsync(admin.renderNewCourse));
router.post("/courses", isLoggedIn, isAdmin, catchAsync(admin.createCourse));

router.get("/users", isLoggedIn, isAdmin, catchAsync(admin.adminUserList));
router.post("/users/:id/reset", isLoggedIn, isAdmin, catchAsync(admin.resetUserPassword));
router.delete("/users/:id", isLoggedIn, isAdmin, catchAsync(admin.deleteUser));
router.get("/users/new", isLoggedIn, isAdmin, admin.renderUserForm);
router.post("/users", isLoggedIn, isAdmin, catchAsync(admin.createUser));

// SUBJECT MANAGEMENT
router.get("/subjects", isLoggedIn, isAdmin, catchAsync(admin.adminSubjectList));
router.get("/subjects/new", isLoggedIn, isAdmin, admin.renderNewSubject);
router.post("/subjects", isLoggedIn, isAdmin, catchAsync(admin.createSubject));
router.get("/subjects/:id/edit", isLoggedIn, isAdmin, catchAsync(admin.renderEditSubject));
router.put("/subjects/:id", isLoggedIn, isAdmin, catchAsync(admin.updateSubject));
router.delete("/subjects/:id", isLoggedIn, isAdmin, catchAsync(admin.deleteSubject));

// PROJECT MANAGEMENT
router.get("/projects", isLoggedIn, isAdmin, catchAsync(admin.adminProjectList));
router.delete("/projects/:id", isLoggedIn, isAdmin, catchAsync(admin.deleteProject));

module.exports = router;
