const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isReviewAuthor } = require("../middleware");
const Project = require("../models/project");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");

const catchAsync = require("../utils/catchAsync");

router.post("/", isLoggedIn, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
