/**
 * Module dependencies.
 */
var express     = require('express');
var fs          = require('fs');
passport = require('passport');
var io = require('socket.io');
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load Configurations

var env             = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config          = require('./config/config');
var auth            = require('./config/middlewares/authorization');
var db              = require('./config/sequelize');
var passport        = require('./config/passport');

var app = express();
//Initialize Express
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


require('./config/express')(app, passport);
require('./config/routes').init(app, passport, auth);


//Start the app by listening on <port>
var port = process.env.PORT || config.port;
var server = app.listen(port);
console.log('Express app started on port ' + port);

require('./app/controllers/workers/worker');
//io.sockets.on('connection', worker);
require('./config/socket-io')(app, server);




//Initialize Routes







//expose app
exports = module.exports = app;