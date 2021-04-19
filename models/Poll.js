const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionScheme = new Schema({
    name: String,
    count: { type: Number, default: 0 }
})
const pollSchema = new Schema({
    name: String,
    options: [optionScheme],
    shares: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    owner: { type: mongoose.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Poll', pollSchema);