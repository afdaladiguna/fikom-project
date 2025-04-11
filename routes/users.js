/* eslint-disable function-call-argument-newline */
/* eslint-disable function-paren-newline */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const { storeReturnTo } = require('../middleware');

router
  .route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate('local', {
      // logs the user in and clears req.session
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.login // res.locals.returnTo to redirect the user after login
  );

router.get('/logout', users.logout);

module.exports = router;
