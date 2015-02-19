/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');
var constants = require('../../config/constants');
var config = require('../../config/config');

var nodemailer = require("nodemailer");

var log4js = require('log4js');
var logger = log4js.getLogger("Users");



var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail_remainder,
        pass: config.mail_remainder_password
    }
  });



/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
  var error = req.flash('errors');

  res.render('users/signin', {
        title: 'Signin',
        message: error
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: {}
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    logger.debug('Logout: { id: ' + req.user.id + ', username: ' + req.user.username + '}');
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var message = null;

    var user = db.User.build(req.body);

    user.provider = 'local';
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
    logger.debug('New User (local) : { id: ' + user.id + ' username: ' + user.username + ' }');
    

    db.User.find({where:{username:req.body.username}}).success(function(_user){

      if(_user){
        logger.debug("We find user:"+_user.id+" using the username field in signup form");
        return res.render('users/signup', {
                errors: [constants.EXIST_USERNAME],
                user: user
            });
      }

      db.User.find({where:{email:req.body.email}}).success(function(_user_by_email){
        if(_user_by_email){
          logger.debug("We find user:"+_user_by_email.id+" using the email field in signup form");
          return res.render('users/signup', {
                  errors: [constants.EXIST_EMAIL],
                  user: user
              });

        }
        user.save().success(function(){
          req.login(user, function(err){
            if(err) return next(err);
            res.redirect('/');
          });
        }).error(function(err){

          
          logger.debug("el error es:"+err);
            if (err) {
                return res.render('users/signup', {
                    errors: ["Error in create user"],
                    user: user
                });
            }
        });



      });
      
    });
    
};

/**
 *  Show profile
 */
exports.show = function(req, res) {
    var user = req.user;

    res.render('users/edit', {
        title: user.name,
        user: user
    });
};


exports.update = function(req, res){

  logger.debug("req =="+JSON.stringify(req.body));
  var user = req.user;
  hashedPassword = user.encryptPassword(req.body.password, user.salt);

  if(hashedPassword == user.hashedPassword){
    logger.debug("Correct old path, going to update");

    if(typeof req.body.new_password !== 'undefined' && req.body.new_password){
       hashedPassword = user.encryptPassword(req.body.new_password, user.salt);
    }

    db.User.find({where:{username:req.body.username}}).success(function(_user){
      logger.debug("_user id:"+_user.id);
      logger.debug("user id:"+user.id);
      if(_user && _user.id !== user.id){
        logger.debug("We find user:"+_user.id+" using the username field in signup form");
        return res.jsonp({error:constants.EXIST_USERNAME,user:user});  
      }

      db.User.find({where:{email:req.body.email}}).success(function(_user_by_email){
       
        if(_user_by_email && _user_by_email.id !== user.id){
          logger.debug("We find user:"+_user_by_email.id+" using the email field in signup form");
          return res.jsonp({error:constants.EXIST_EMAIL,user:user}); 
         

        }
        user.updateAttributes({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword
        }).success(function(user){
            return res.jsonp(user);
        }).error(function(err){
          logger.debug("Error in update user:"+err);
          res.jsonp({error:"Error in update user",user:user});  
        });



      });
      
    });

    
  }else{
    return res.jsonp({error:"Incorrect passwords",user:user});  
  }
  

};
/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    db.User.find({where : { id: id }}).success(function(user){
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    }).error(function(err){
      next(err);
    });
};

exports.forgetPassword = function(req, res){


  db.User.find({where:{email:req.body.email}}).success(function(_user_by_email){
      
      if(!_user_by_email){
        
        return res.jsonp({error:constants.NOT_EXIST_EMAIL}); 
       

      }
      logger.debug("_user_by_email id:"+_user_by_email.id);
      hashedPassword = _user_by_email.encryptPassword(constants.DEFAULT_PASS, _user_by_email.salt);
      logger.debug("el new password es:"+hashedPassword);


      _user_by_email.updateAttributes({
        hashedPassword: hashedPassword
      }).success(function(user){

        smtpTransport.sendMail({
          from: 'not-reply@pi2p.net',
          to: 'carlos.morell@pi2p.net',
          subject: 'Password recovery',
          text: 'System change your password. Now it is: '+constants.DEFAULT_PASS+" please sign in and change it."
        }, function(err, response) {
            console.log(err || response);
            return res.jsonp({success: constants.SEND_FORGOT_PASSWORD});
        });

          
      }).error(function(err){
        logger.debug("Error in update user:"+err);
        return res.jsonp({error:"Error in update user"});  
      });



    
  });
  

};