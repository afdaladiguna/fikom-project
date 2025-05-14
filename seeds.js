require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const User = require("./models/user");
const Course = require("./models/course");
const Assignment = require("./models/assignment");
const Project = require("./models/project");
const Review = require("./models/review");

const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const seedDB = async () => {
  // Hapus semua isi koleksi
  await User.deleteMany({});
  await Course.deleteMany({});
  await Assignment.deleteMany({});
  await Project.deleteMany({});
  await Review.deleteMany({});

  // Tambah mahasiswa dengan NIM dari 13020210009 sampai 13020210015
  for (let i = 1; i <= 20; i++) {
    const nim = `130202100${String(i).padStart(2, "0")}`;
    const student = new User({
      name: faker.person.fullName(),
      username: nim,
      actualId: nim,
      role: "mahasiswa",
    });
    await User.register(student, nim);
  }

  const admin = new User({
    name: "Master Administrator",
    username: "admin",
    actualId: "admin",
    role: "admin",
  });
  await User.register(admin, "admin");

  console.log("Seeding complete");
  mongoose.connection.close();
};

seedDB();
