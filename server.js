var express = require('express');
var expressSession = require('express-session');
var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;

var app = express();

app.use(expressSession({secret: 'SEKRITOMIGAWD'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new facebookStrategy({
	clientID: '1590012404569038',
	clientSecret: '68a026b93eeb733c1e411498d61534da',
	callbackURL: 'http://localhost:9876/auth/facebook/callback'
}, function(token, refreshToken, profile, done){
	return done(null, profile);
}));

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done){
	done(null, obj);
});

var isAuthed = function(req, res, next){
	if(!req.isAuthenticated()){
		return res.redirect('/failure');
	} else {
		next();
	}
}

app.get('/me', isAuthed, function(req, res){
	return res.json(req.user);
});

app.get('failure', function(req, res){
	return res.redirect('/auth/facebook');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
 	successRedirect: '/me',
 	failureRedirect: '/failure'
}));

app.listen(9876, function(){
	console.log('Listening on port 9876');
});