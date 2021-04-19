const express = require('express')
const { loggedIn } = require('./loggedIn');
const router = express.Router();
const Poll = require('../models/Poll')
const createError = require('http-errors')
const asyncHandler = require('express-async-handler')

router.post('/', loggedIn, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const poll = new Poll({ name, owner: req.user._id })

    res.json(await poll.save())
}))

router.put('/:id/name', loggedIn, asyncHandler(async (req, res, next) => {
    const poll = await Poll.findById(req.params.id).exec();
    if (!poll.owner.equals(req.user._id)) return next(createError(404, `This is not your poll.`))
    const { name } = req.body;
    poll.set({ name })
    res.json(await poll.save())
}))

router.post('/:id/options', loggedIn, asyncHandler(async (req, res, next) => {
    const poll = await Poll.findById(req.params.id).exec();
    if (!poll.owner.equals(req.user._id)) return next(createError(404, `This is not your poll.`))
    const { name } = req.body;

    poll.options.push({ name })
    res.json(await poll.save())
}))

router.delete('/:id/options/:option_id', loggedIn, asyncHandler(async (req, res, next) => {
    const poll = await Poll.findById(req.params.id).exec();
    if (!poll.owner.equals(req.user._id)) return next(createError(404, `This is not your poll.`))

    poll.options.id(req.params.option_id).remove();
    res.json(await poll.save())
}))

router.post('/:id/shares', loggedIn, asyncHandler(async (req, res, next) => {
    const poll = await Poll.findById(req.params.id).exec();
    if (!poll.owner.equals(req.user._id)) return next(createError(404, `This is not your poll.`))
    const { _id } = req.body;

    poll.shares.push(_id)
    res.json(await poll.save())
}))

router.delete('/:id/shares/:user', loggedIn, asyncHandler(async (req, res, next) => {
    const poll = await Poll.findById(req.params.id).exec();
    if (!poll.owner.equals(req.user._id)) return next(createError(404, `This is not your poll.`))
    poll.shares.pull(req.params.user)
    res.json(await poll.save())
}))

router.get('/me', loggedIn, asyncHandler(async (req, res) => {
    const polls = await Poll.find({ owner: req.user._id }).exec();
    res.json(polls)
}))

router.get('/', loggedIn, asyncHandler(async (req, res) => {
    const polls = await Poll.find({ shares: req.user._id })
    res.json(polls)
}))

module.exports = router