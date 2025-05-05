const express = require("express");
const router = express.Router({ mergeParams: true });
const assignments = require("../controllers/assignments");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isLecturer } = require("../middleware");

// Tambahan multer
const multer = require("multer");
const { fileStorage } = require("../cloudinary"); // Jika kamu simpan ke Cloudinary
const upload = multer({ storage: fileStorage });

// Tambah tugas (POST)
router.route("/").post(
  isLecturer,
  upload.single("pdfFile"), // Tambahkan middleware multer di sini
  catchAsync(assignments.createAssignment)
);

// Form tambah tugas
router.get("/new", isLecturer, assignments.renderNewForm);

// Detail tugas, update, hapus
router.route("/:assignmentId").get(isLoggedIn, catchAsync(assignments.showAssignment)).put(isLecturer, catchAsync(assignments.updateAssignment)).delete(isLecturer, catchAsync(assignments.deleteAssignment));

// Form edit tugas
router.get("/:assignmentId/edit", isLecturer, catchAsync(assignments.renderEditForm));

module.exports = router;
