var Index = require("../controller/index");
var User = require("../controller/user");

module.exports = function(app) {

	// Index
	app.get("/", Index.index);

	// User
	app.get("/signin", User.showSignIn);
	/*app.get("/signup", User.showSignUp);*/
}
