var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


// 用户登陆，若成功登陆则跳转到首页，反之则回到登陆页
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

//用户注册，若用户名被注册则返回提示，成功注册则创建用户并跳转到首页
var userSignUp = function(username, password, email, description, req, res) {
    mongoose.model('User').find({ 'username' : username }, function(err, users) {
        if (err) {
            console.log(err);
        } else {
            if (users.length) {
                console.log('user exist!');
                res.send("User already exists");
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
                        res.redirect('/');
                    }
                });
            }
        }
    });
};

//用户查询，根据用户名查询用户，返回结果列表
var userQuery = function(req, res) {
    mongoose.model('User').find({ 'username' : req.body.username }, function(err, users) {
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

//更新用户信息
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
                                res.send("update succeed!");
                            }
                        });
                    }
                });
            }
        }
    });
};

//删除用户
var deleteUser = function(username, req, res) {
    mongoose.model('User').find({ 'username' : username }, function(err, users) {
        if (err) {
            console.log(err);
        } else {
            if (!users.length) {
                console.log('user not exist!');
                res.redirect('/login');
            } else {
                users[0].remove(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('deletion succeed!');
                        req.session.destroy(function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.redirect('/login');
                            }
                        });
                    }
                });
            }
        }
    });
};

//渲染用户登陆页，如果用户已登陆，则返回提示信息
exports.showLogin = function(req, res) {
    if (req.session.username) {
        res.send("You are already login!")
    } else {
        res.render("signIn");
    }
};

//渲染用户注册页，如果用户已登陆，则返回提示信息
exports.showSignUp = function(req, res) {
    /*res.json({ message : "the signup page wasn't finish yet" });*/
    if (req.session.username) {
        res.send("You are already login!")
    } else {
        res.render("signUp");
    }
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
    userSignUp(username, password, email, description, req, res);
};

exports.handleQuery = function(req, res) {
    userQuery(req, res);
};


exports.handleUpdate = function(req, res) {
    var username = req.body.username;
    if (username != req.session.username) {
        res.send("sorry, you don't have permission to update user information!");
    } else {
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
    }
};

exports.handleDelete = function(req, res) {
    var username = req.body.username;
    if (username != req.session.username) {
        res.send("sorry, you don't have permission to delete user!");
    } else {
        deleteUser(username, req, res);
    }
};

exports.showUserPage = function(req, res) {
    mongoose.model('User').findOne({ 'username' : req.params.username }, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render("personalCenter", user);
        }
    });
};

//渲染个人作品列表页
exports.showWorkListPage = function(req, res) {
    var username = req.params.username;
    mongoose.model('User').find({ 'username' : username }, function(err, users) {
        if (err) {
            console.log(err);
        } else {
            if (!users.length) {
                res.send("sorry, user isn't exist");
            } else {
                mongoose.model('ArtWork').find({ 'author' : username }, function(err, works) {
                    if (err) {
                        console.log(err);
                    } else {
                        var count = works.length;
                        res.render("artworks", {
                            'username' : username,
                            'workCount' : count
                        });
                    }
                });
            }
        }
    });
}



// 尝试使用http的delete方法，后来觉得没必要，直接用post就好

// exports.deleteUser = function(req, res) {
//  mongoose.model('User').remove({
//      username : req.params.username
//  }, function(err, user) {
//      if (err) {
//          console.log(err);
//      } else {
//          console.log('deletion succeed!');
//          res.json({ message : 'Successfully deleted!' });
//      }
//  });
// }