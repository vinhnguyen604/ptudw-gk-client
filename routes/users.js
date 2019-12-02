var express = require('express');
var router = express.Router();
const passport = require('../config/passport');
const { User } = require('../models/');

/* GET users listing. */
router.get('/login', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  const errors = req.flash().error || [];
  res.render('pages/users/login',
    {
      title: 'Đăng nhập',
      breadcrumb: 'Trang chủ / Khách / Đăng nhập',
      errors
    });
});

router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })
);

router.get('/logout', function (req, res, next) {
  req.logout();
  //req.session.destroy();
  res.redirect('/');
});

router.get('/account',
  authenticationCheck(), //from passport.js
  function (req, res, next) {
    res.render('pages/users/account', 
    { title: 'Tài khoản', 
    breadcrumb: 'Trang chủ / Khách / Tài khoản' });
  });

router.get('/account/confirm', function (req, res, next) {
  res.render('pages/users/acc-confirm', { title: 'Xác nhận', breadcrumb: 'Trang chủ / Khách / Tài khoản / Xác nhận' });
});

router.get('/forgot', function (req, res, next) {
  res.render('pages/users/forgot', { title: 'Khôi phục', breadcrumb: 'Trang chủ / Khách / Khôi phục' });
});

router.get('/forgot/confirm', function (req, res, next) {
  res.render('pages/users/forg-confirm', { title: 'Xác nhận', breadcrumb: 'Trang chủ / Khách / Forgot password / Confirmation' });
});


router.get('/register', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  const errors = req.flash().error || [];
  res.render('pages/users/register',
    {
      title: 'Đăng kí',
      breadcrumb: 'Trang chủ / Khách / Register',
      errors
    });
});

router.post('/register', function (req, res, next) {
  const usr = req.body.username;
  const pwd = req.body.password;
  user = new User();
  user.register(usr, pwd, (err, user) => {
    if (err) {
      req.flash('error', 'Tài khoản đã tồn tại. Hãy đặt tên khác')
      res.redirect('/users/register');
    } else {
      req.login(user, function(err) {
        res.redirect('/users/register/confirm');
      })
    }
  });
});


router.get('/register/confirm', function (req, res, next) {
  res.render('pages/users/confirmation', { title: 'Xác nhận', breadcrumb: 'Trang chủ / Khách / Confirmation' });
});


module.exports = router;
