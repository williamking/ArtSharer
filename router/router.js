var Index = require("../controller/index");
var User = require("../controller/user");

module.exports = function(app) {

	// Index
	app.get("/", Index.index);

	// User
	app.get("/sign_in", User.showSignIn);
	/*app.get("/signup", User.showSignUp);*/
	app.post("/handle_sign_in", User.handleSignIn);
}
