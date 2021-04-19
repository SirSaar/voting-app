const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto')

const userSchema = new Schema({
    email: 'string',
    hash: 'string',
    salt: 'string',
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

module.exports = mongoose.model('User', userSchema);