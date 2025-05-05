const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fikom-project",
    allowedFormats: ["jpeg", "png", "jpg", "pdf"],
  },
});

const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "fikom-project/files",
      resource_type: "raw", // WAJIB untuk PDF, DOCX, dll
      format: "pdf", // Ini pastikan file tetap berformat .pdf
      public_id: file.originalname.replace(/\.[^/.]+$/, ""), // nama file tanpa ekstensi
    };
  },
});

module.exports = {
  cloudinary,
  storage,
  fileStorage,
};
