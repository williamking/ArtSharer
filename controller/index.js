

// index page
exports.showIndex = function(req, res) {
	if (req.session.username) {            //检测是否已登陆
		res.render("index", {
			username : req.session.username
		});
	} else {
		res.redirect('/login');
	}
};