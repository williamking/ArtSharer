
exports.showSignIn = function(req, res) {
	res.render("signIn");
};

exports.handleSignIn = function(req, res) {
	res.redirect("/");
};

exports.showPersonalCenter = function(req, res) {
	res.render("personalCenter", {
		username: "XiaoMing"
	});
};