const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("./users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    const user = new User({
      username, // diisi NIM
      actualId: username, // untuk keperluan tampilan atau kebutuhan lain
      name,
      role: "mahasiswa",
    });
    req.flash("success", "Registrasi berhasil! Silahkan login.");
    res.redirect("/login");
  } catch (e) {
    req.flash("error", "NIM sudah terdaftar.");
    console.log(e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("./users/login");
};

module.exports.login = (req, res) => {
  try {
    req.flash("success", "Berhasil login.");
    const redirectUrl = res.locals.returnTo || "/projects"; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
  } catch (e) {
    req.flash("error", "NIM belum terdaftar atau password salah.");
    res.redirect("/login");
  }
};

module.exports.logout = (req, res, next) => {
  // eslint-disable-next-line prefer-arrow-callback, func-names
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Berhasil logout.");
    res.redirect("/");
  });
};
