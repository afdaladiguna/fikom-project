const express = require("express");
const router = express.Router();
const assignments = require("../controllers/assignments");
const { isLoggedIn, isDosen } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.route("/").get(catchAsync(assignments.index)).post(isLoggedIn, isDosen, catchAsync(assignments.createAssignment));

router.get("/new", isLoggedIn, isDosen, assignments.renderNewForm);

router.get("/:id", isLoggedIn, catchAsync(assignments.showAssignment));

router.post("/:assignmentId/score/:projectId", isLoggedIn, isDosen, catchAsync(assignments.giveScore));

module.exports = router;
