require("dotenv").config(); // ⬅️ penting untuk memuat .env

const mongoose = require("mongoose");
const User = require("./models/user");
const Assignment = require("./models/assignment");
const Project = require("./models/project");

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Database connected");

  await User.deleteMany({});
  await Assignment.deleteMany({});
  await Project.deleteMany({});

  // Create Dosen
  const dosen = new User({
    name: "Dr. Dosen 1",
    role: "dosen",
    username: "dosen1",
    actualId: "dosen1",
  });
  await User.register(dosen, "test");

  // Create Mahasiswa
  const mahasiswa1 = new User({
    name: "John Doe",
    role: "mahasiswa",
    username: "13020210001",
    actualId: "13020210001",
  });
  await User.register(mahasiswa1, "test");

  const mahasiswa2 = new User({
    name: "Jane Doe",
    role: "mahasiswa",
    username: "13020210002",
    actualId: "13020210002",
  });
  await User.register(mahasiswa2, "test");

  // Create Assignments
  const assignment1 = new Assignment({
    title: "Project Web 1",
    subject: "Rekayasa Perangkat Lunak",
    description: "Buat sistem informasi sederhana menggunakan Express.js",
    deadline: new Date("2024-05-15"),
    createdBy: dosen._id,
  });
  await assignment1.save();

  const assignment2 = new Assignment({
    title: "Project Web 2",
    subject: "Pemrograman Web Lanjut",
    description: "Buat website dengan fitur CRUD dan autentikasi",
    deadline: new Date("2024-06-10"),
    createdBy: dosen._id,
  });
  await assignment2.save();

  // Create Projects
  const projects = [
    {
      title: "Sistem Reservasi Hotel",
      description: "Proyek pemesanan hotel dengan Node.js dan MongoDB",
      repository: "https://github.com/john/hotel-reservation",
      category: "Website",
      author: mahasiswa1._id,
      assignment: assignment1._id,
      score: 90,
    },
    {
      title: "Aplikasi Perpustakaan",
      description: "Sistem manajemen buku dan anggota perpustakaan",
      repository: "https://github.com/jane/perpustakaan",
      category: "Website",
      author: mahasiswa2._id,
      assignment: assignment1._id,
      score: 85,
    },
    {
      title: "Platform Jual Beli Online",
      description: "Website e-commerce sederhana menggunakan Express.js",
      repository: "https://github.com/aulia/ecommerce",
      category: "E-Commerce",
      author: mahasiswa1._id,
      assignment: assignment2._id,
      score: 95,
    },
    {
      title: "Website Galeri Portofolio",
      description: "Menampilkan karya desain UI/UX dalam satu tempat",
      repository: "https://github.com/fahmi/portofolio",
      category: "Multimedia",
      author: mahasiswa2._id,
      assignment: assignment2._id,
      score: 92,
    },
  ];

  for (let proj of projects) {
    const project = new Project(proj);
    await project.save();
  }

  console.log("Seeding complete");
  process.exit();
});
