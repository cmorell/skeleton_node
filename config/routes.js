
var log4js = require('log4js');

var logger = log4js.getLogger("Routes");

var index       = require('../app/controllers/index');





exports.init = function(app, passport, auth) {


	 // Home route
    app.get('/',  index.render);

    logger.debug("Initializing Routes");


	 // User Routes
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);
    app.get('/users/:userId',auth.requiresLogin, users.me);
    app.post('/users/forgotPassword', users.forgetPassword);
    app.put('/users/:userId', auth.requiresLogin, users.update);

    // Setting up the users api
    app.post('/users', users.create);

    // Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
    	successRedirect:'/',
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    

    // Finish with setting up the userId param
    app.param('userId', users.user);

};