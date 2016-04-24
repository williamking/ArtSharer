var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');



var userSignIn = function(username, password, req, res) {
	mongoose.model('User').find(
	{
		'username' : username,
		'password' : password
	}, function(err, users) {
		if (err) {
			console.log(err);
		} else {
			if (!users.length) {
				console.log('login failed!');
				res.redirect('/login');
			} else {
				req.session.username = username;
				console.log('login succeed!');
				res.redirect('/');
			}
		}
	});
};

var userSignUp = function(username, password, email, description, req, res) {
	mongoose.model('User').find({ 'username' : username }, function(err, users) {
		if (err) {
			console.log(err);
		} else {
			if (users.length) {
				console.log('user exist!');
				res.status(404).send("User already exists");
			} else {
				mongoose.model('User').create({
					'username' : username,
					'password' : password,
					'descript' : description,
					'email' : email,
					'artworks' : [],
					'followers' : [],
					'starArtists' : [],
					'starWorks' : []
				}, function(err, user) {
					if (err) {
						res.send('There was a problem adding the information to the database.');
					} else {
						req.session.username = username;
						console.log('sign up succeed!');
						res.send("OK");
					}
				});
			}
		}
	});
};

var userQuery = function(username, req, res) {
	mongoose.model('User').find({ 'username' : username }, function(err, users) {
		if (err) {
			console.log(err);
		} else {
			if (!users.length) {
				console.log('user not exist!');
				res.redirect('/login');
			} else {
				res.json(users);
			}
		}
	});
};

var updateUser = function(userModify, req, res) {
	mongoose.model('User').find({ 'username' : userModify.username }, function(err, users) {
		if (err) {
			console.log(err);
		} else {
			if (!users.length) {
				console.log('user not exist!');
				res.redirect('/login');
			} else {
				mongoose.model('User').findOne({ 'username' : userModify.username }, function(err, user) {
					if (err) {
						console.log(err);
					} else {
						user.update({
							$set : userModify 
						}, function(err, user) {
							if (err) {
								console.log(err);
							} else {
								console.log('update succeed!');
								res.redirect('/login');
							}
						});
					}
				});
			}
		}
	});
};

var deleteUser = function(username, req, res) {
	mongoose.model('User').find({ 'username' : username }, function(err, users) {
		if (err) {
			console.log(err);
		} else {
			if (!users.length) {
				console.log('user not exist!');
				res.redirect('/login');
			} else {
				mongoose.model('User').findOne({ 'username' : username }, function(err, user) {
					if (err) {
						console.log(err);
					} else {
						user.remove(function(err, blob) {
							if (err) {
								console.log(err);
							} else {
								console.log('deletion succeed!');
								res.redirect('/login');
							}
						});
					}
				});
			}
		}
	});
};

exports.showLogin = function(req, res) {
	res.render("signIn");
};

exports.showSignUp = function(req, res) {
	/*res.json({ message : "the signup page wasn't finish yet" });*/
	res.render("signUp");
};

exports.handleLogin = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	userSignIn(username, password, req, res);
};

exports.handleLogout = function(req, res) {
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("logout succeed!");
			res.redirect('/login');
		}
	})
};

exports.handleSignUp = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var description = req.body.description;

	console.log(req.body);

	userSignUp(username, password, email, description, req, res);
};

exports.handleQuery = function(req, res) {
	var username = req.body.username;
	userQuery(username, req, res);
};

exports.handleUpdate = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var descript = req.body.descript;
	var userModify = {
		'username' : req.body.username
	};
	if (req.body.password) {
		userModify.password = req.body.password;
	}
	if (req.body.descript) {
		userModify.descript = req.body.descript;
	}
	if (req.body.email) {
		userModify.email = req.body.email;
	}
	updateUser(userModify, req, res);	
};

exports.handleDelete = function(req, res) {
	var username = req.body.username;
	deleteUser(username, req, res);
};

exports.showUserPage = function(req, res) {
	mongoose.model('User').findOne({ 'username' : req.params.username }, function(err, user) {
		if (err) {
			console.log(err);
		} else {
			// res.render("userpage", {
			// 	username : user.username,
			// 	descript : user.dscript,
			// 	artworks : user.artworks,
			// });
			res.json({
				username : user.username,
				descript : user.descript,
				artworks : user.artworks
			});
		}
	});
};



// 尝试使用http的delete方法，后来觉得没必要，直接用post就好

// exports.deleteUser = function(req, res) {
// 	mongoose.model('User').remove({
// 		username : req.params.username
// 	}, function(err, user) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log('deletion succeed!');
// 			res.json({ message : 'Successfully deleted!' });
// 		}
// 	});
// }