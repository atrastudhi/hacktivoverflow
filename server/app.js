var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const kue = require('kue');
const { cronJob } = require('./helpers/helper')

const cron = require('node-cron')

cron.schedule('5 8 * * 0', () => {
  cronJob()
})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoose connected!')
});

var usersRouter = require('./routes/users');

var app = express();

kue.app.listen(4000)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors())
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.status(500).json('error');
});

module.exports = app;
