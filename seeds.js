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
  for (let i = 4; i < 16; i++) {
    const student = new User({
      name: faker.person.fullName(),
      username: `1302021000${i}`,
      actualId: `1302021000${i}`,
      role: "mahasiswa",
    });
    await User.register(student, "password");
  }

  console.log("Seeding complete");
  mongoose.connection.close();
};

seedDB();
