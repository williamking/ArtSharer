
exports.showSignIn = function(req, res) {
	res.render("signin");
}

exports.handleSignIn = function(req, res) {
	res.redirect("/");
}