require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CON_STR, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => debug('DB connected succesfully'))
    .catch((dbErr) => {
        throw dbErr;
    });

mongoose.set('debug', process.env.ENV === 'development' ? true : false);

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport')
require('./passport');

const debug = require('debug')('app');
const cors = require('cors');
var session = require("express-session")
const routes = require('./router');
const app = express();
const morgan = require('morgan')
const createError = require('http-errors');

app.use(cors())
app.use(bodyParser.json());   //transition req.body from json to Object
app.use(morgan('dev'));     //should be removed in production
// app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', routes);

// catch 404 -can't find resource , and forward to error handler
app.use((req, res, next) => {
    var err = new createError(404, 'Not Found');
    next(err);
});

//////////ERROR HANDLING
//remember: 4xx - there's an error in the request itself
//400 -error in the requset itself
//404 not found
//5xx - there's an error in the processing of the response
//500- server's fault
app.use((err, req, res, next) => {
    console.log(err)
    /////mongoose invalid ObjectId
    if (err.name == 'CastError') {
        err.status = 400;
    }
    /////mongoose validation error
    if (err.name == 'ValidationError') {
        err.status = 400;
    }

    res.status(err.status || 500);
    debug(err);
    res.json(err);
});

app.listen(80, function () {
    debug('CORS-enabled web server listening on port 80')
})

module.exports = app;