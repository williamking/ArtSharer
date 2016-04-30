var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');

//创建作品
var createWork = function(req, res) {
    var author = req.params.username;
    var workTitle = req.body.workTitle;
    if (req.body.tag) {
        var tags = req.body.tag.split(',');
    } else {
        var tags = [];
    }
    var filepath = "public/imgs/" + req.file.filename    // + "." + req.file.originalname.split('.')[1];
    mongoose.model('ArtWork').find({ 
        'workTitle' : workTitle,
        'author' : author }, function(err, works) {
        if (err) {
            console.log(err);
        } else {
            if (works.length) {
                fs.unlink(filepath, function() {
                    res.send("file exist!");
                });
            } else {
                mongoose.model('ArtWork').create({
                    'workTitle' : workTitle,
                    'author' : author,
                    'isFork' : false,
                    'forkFrom' : null,
                    'url' : filepath,
                    'createTime' : new Date(),
                    'lastModified' : new Date(),
                    'tags' : tags
                }, function(err, artWork) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("artwork create succeed!");
                    }
                });
            }
        }
    });
};

//删除作品
var deleteWork = function(req, res) {
    var workTitle = req.body.workTitle;
    var author = req.params.username;
    if (req.session.username != req.params.username) {
        res.send("sorry, you don't have permission to delete the work!");
    } else {
        mongoose.model('ArtWork').find({
            'workTitle' : workTitle,
            'author' : author
        }, function(err, works) {
            if (err) {
                console.log(err);
            } else {
                if (!works.length) {
                    res.send("img not found!");
                } else {
                    var filepath = works[0].url;
                    works[0].remove(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            fs.unlink(filepath, function() {
                                res.send("file delete!");
                            });
                        }
                    });
                }
            }
        });
    }
};

//更新作品信息
var updateWork = function(req, res) {
    var workTitle = req.body.workTitle;
    var author = req.params.username;
    var tags = req.body.tag.split(',');
    // var filepath = "public/imgs/" + req.file.filename;
    mongoose.model('ArtWork').find({
        'workTitle' : workTitle,
        'author' : author
    }, function(err, works) {
        if (err) {
            console.log(err);
        } else {
            if (!works.length) {
                fs.unlink(filepath, function() {
                    res.send("img not found!");
                });
            } else {
                var workModify = {
                    'tags' : tags,
                    'lastModified' : new Date()
                }
                if (req.file) {
                    var filepath = "public/imgs/" + req.file.filename;
                    fs.unlink(works[0].url, function() {});
                    workModify.url = filepath;
                }
                works[0].update({
                    $set : workModify
                }, function(err, work) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("update succeed!");
                    }
                });
            }
        }
    });
};

//查询作品，返回结果列表
var queryWorks = function(req, res) {
    var author = req.body.author;
    var workTitle = req.body.workTitle;
    var query = {};
    if (author) {
        query.author = author;
    }
    if (workTitle) {
        query.workTitle = workTitle;
    }
    mongoose.model('ArtWork').find(query, function (err, works) {
        if (err) {
            console.log(err);
        } else {
            if (!works.length) {
                res.send('img not found!');
            } else {
                res.json(works);
            }
        }
    });
};

//渲染作品详情页
exports.showWorkPage = function(req, res) {
    mongoose.model('ArtWork').find({
        'workTitle' : req.params.worktitle,
        'author' : req.params.username }, function(err, artWorks) {
            if (!artWorks.length) {
                res.send("sorry, can't find this work");
            } else {
                var artWork = artWorks[0];
                res.render("artworkDetail", {
                    workTitle : artWork.workTitle,
                    author : artWork.author,
                    username : req.session.username
                });
            }
        });
};

//渲染作品创建页面
exports.showWorkCreatePage = function(req, res) {
    if (req.session.username == req.params.username) {
        res.render("createArtwork", {
            username : req.params.username
        });
    } else {
        res.send("you can't access this page");
    }
    
}


exports.handleCreate = function(req, res) {
    if (req.session.username != req.params.username) {
        var filepath = "public/imgs/" + req.file.filename
        fs.unlink(filepath, function() {
            res.send("sorry, you don't have the permission to create work!");
        });
    } else {
        createWork(req, res);
    }
};

exports.handleDelete = function(req, res) {
    if (req.session.username != req.params.username) {
        res.send("sorry, you don't have the permission to delete work!");
    } else {
        deleteWork(req, res);
    }
};

exports.handleUpdate = function(req, res) {
    if (req.session.username != req.params.username) {
        res.send("sorry, you don't have the permission to update work!");
    } else {
        updateWork(req, res);
    }
};

exports.handleQuery = function(req, res) {    //需要确认一下具体的返回形式
    queryWorks(req, res);
};

exports.showEditPage = function(req, res) {
	res.render("createArtwork");
};
