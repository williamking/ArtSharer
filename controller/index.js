

// index page
exports.showIndex = function(req, res) {
	if (req.session.username) {
		res.render("index");
	} else {
		res.send("please login first");
	}
};