const Project = require("../models/project");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const project = await Project.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  project.reviews.push(review);
  await review.save();
  await project.save();
  req.flash("success", "Created new review!");
  res.redirect(`/projects/${project._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Project.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/projects/${id}`);
};
