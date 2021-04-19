const express = require('express');
const router = express.Router();

const user = require('./routes/user');
const poll = require('./routes/poll');
router.use('/user', user);
router.use('/poll', poll);

module.exports = router;