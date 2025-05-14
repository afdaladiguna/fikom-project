const ExpressError = require("./utils/ExpressError");
const Project = require("./models/project");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Harap login terlebih dahulu!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isLecturer = async (req, res, next) => {
  if (!req.isAuthenticated() || req.user.role !== "dosen") {
    req.flash("error", "Hanya dosen yang dapat mengakses fitur ini.");
    return res.redirect("/projects");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that.");
    return res.redirect(`/projects/${id}`);
  }
  next();
};
module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || req.user.role !== "admin") {
    req.flash("error", "Hanya admin yang dapat mengakses halaman ini.");
    return res.redirect("/");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that.");
    return res.redirect(`/projects/${id}`);
  }
  next();
};
