const createError = require('http-errors');
function loggedIn(req, res, next) {
    console.log(req.user)
    if (req.user) {
        next();
    } else {
        res.status(401).json(createError(401, 'You are not logged in.'));
    }
}

module.exports.loggedIn = loggedIn