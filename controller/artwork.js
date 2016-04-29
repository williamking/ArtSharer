var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fs = require('fs');

var createWork = function(req, res) {
	var author = req.params.username;
	var workTitle = req.body.workTitle;
	var filepath = "public/imgs/" + req.file.filename    // + "." + req.file.originalname.split('.')[1];
	mongoose.model('ArtWork').find({ 'workTitle' : workTitle }, function(err, works) {
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
					'tags' : []
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
	// mongoose.model('ArtWork').find({ 'workTitle' : workTitle }, function(err, works) {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		if (works.length) {
	// 			res.send('artWork exist!');
	// 		} else {
	// 			mongoose.model('ArtWork').create({
	// 				'workTitle' : workTitle,
	// 				'author' : author,
	// 				'isFork' : false,
	// 				'forkFrom' : null,
	// 				'url' : "#",
	// 				'createTime' : new Date(),
	// 				'lastModified' : new Date(),
	// 				'tags' : []
	// 			}, function(err, artWork) {
	// 				if (err) {
	// 					res.send('There was a problem adding the information to the database.');
	// 				} else {
	// 					res.send("artWork create succeed!");
	// 				}
	// 			});
	// 		}
	// 	}
	// });
};

var deleteWork = function(req, res) {
	var workTitle = req.body.workTitle;
	var author = req.params.username;
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
};

var updateWork = function(req, res) {
	var workTitle = req.body.workTitle;
	var author = req.params.username;
	var tags = req.body.tags.split(',');
	var filepath = "public/imgs/" + req.file.filename;
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
				fs.unlink(works[0].url, function() {});
				var workModify = {
					'tags' : tags,
					'url' : filepath,
					'lastModified' : new Date()
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

exports.showWorkPage = function(req, res) {
	mongoose.model('ArtWork').find({
		'workTitle' : req.params.worktitle,
		'author' : req.params.username }, function(err, artWorks) {
			if (!artWorks.length) {
				res.send("sorry, can't find this work");
			} else {
				var artWork = artWorks[0];
				res.json({
					workTitle : artWork.workTitle,
					workUrl : artWork.url,
					createTime : artWork.createTime,
					lastModified : artWork.lastModified,
				});
			}
		});
	// mongoose.model('ArtWork').findOne({
	// 	'workTitle' : req.params.worktitle,
	// 	'author' : req.params.username }, function(err, artWork) {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			// res.render('workpage', {
	// 			// 	workTitle : artWork.workTitle,
	// 			// 	workUrl : artWork.url,
	// 			// 	createTime : artWork.createTime,
	// 			// 	lastModified : artWork.lastModified,
	// 			// });
	// 			res.json({
	// 				workTitle : artWork.workTitle,
	// 				workUrl : artWork.url,
	// 				createTime : artWork.createTime,
	// 				lastModified : artWork.lastModified,
	// 			});
	// 		}
	// 	});
};

exports.handleCreate = function(req, res) {
	createWork(req, res);
};

exports.handleDelete = function(req, res) {
	deleteWork(req, res);
};

exports.handleUpdate = function(req, res) {
	updateWork(req, res);
	var workTitle = req.body.workTitle;
	var author = req.body.author;
	var url = '#';
	var isFork = false;
	var forkFrom = null;
	var createTime = new Date();
	var lastModified = new Date();
	var tags = [];

	var newArtWork = {
		'workId' : 1,
		'workTitle' : workTitle,
		'author' : author,
		'isFork' : isFork,
		'forkFrom' : forkFrom,
		'url' : url,
		'createTime' : createTime,
		'lastModified' : lastModified,
		'tags' : tags
	};
};

exports.handleQuery = function(req, res) {    //需要确认一下具体的返回形式
	queryWorks(req, res);
};

exports.showEditPage = function(req, res) {
	res.render("createArtwork");
};
