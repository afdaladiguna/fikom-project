const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["mahasiswa", "dosen", "admin"],
    default: "mahasiswa",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  actualId: { type: String, required: true }, // menyimpan NIM jika mahasiswa, atau NIDN jika dosen
});

UserSchema.plugin(passportLocalMongoose); // menggunakan "username" sebagai default

module.exports = mongoose.model("User", UserSchema);
