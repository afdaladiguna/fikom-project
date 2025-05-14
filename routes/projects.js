const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor } = require("../middleware");
const projects = require("../controllers/projects");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Project = require("../models/project");

router.route("/").get(catchAsync(projects.index)).post(isLoggedIn, upload.array("image"), catchAsync(projects.createProject));

router.get("/my-projects", isLoggedIn, catchAsync(projects.myProjects));

router.get("/new", isLoggedIn, projects.renderNewForm);

router.route("/:id").get(catchAsync(projects.showProject)).put(isLoggedIn, isAuthor, upload.array("image"), catchAsync(projects.updateProject)).delete(isLoggedIn, isAuthor, catchAsync(projects.deleteProject));
router.post("/:id/score", isLoggedIn, catchAsync(projects.giveScore));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(projects.renderEditForm));

module.exports = router;
