const passport = require('passport');
const express = require('express');
const { loggedIn } = require('./loggedIn');
const router = express.Router();
const createHttpError = require('http-errors');
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

router.get('/profile', loggedIn, (req, res) => {
    res.json(req.user);
})

router.get('/', loggedIn, asyncHandler(async (req, res) => {
    const users = await User.find({ _id: { '$neq': req.user._id } }, 'email').exec()
    res.json(users);
}))

router.post('/login',
    passport.authenticate('local'), function (req, res) {
        res.json({ email: req.user.email })
    }
);

router.post('/logout', (req, res) => {
    req.logout();
    res.json(req.user)
})

router.post('/signup', asyncHandler(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
        throw createHttpError(400, 'email is required')
    }

    if (!password) {
        throw createHttpError(400, 'password is required')
    }

    const finalUser = new User({ email, password });

    finalUser.setPassword(password);

    await finalUser.save();
    res.json({ email })
}));

module.exports = router;