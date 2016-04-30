var Index = require("../controller/index");
var User = require("../controller/user");
var ArtWork = require("../controller/artwork");
var multer = require("multer");

module.exports = function(app) {
	// app.use(bodyParser.urlencoded({
	// 	extended: true
	// }));

	// Index
	app.get("/", Index.showIndex);

	// app.get("/test_editor", ArtWork.showEditPage);
	// page render
	app.get("/login", User.showLogin);
	app.get("/signup", User.showSignUp);
	app.get("/logout", User.handleLogout);
	app.get("/user/:username", User.showUserPage);
	app.get("/user/:username/artwork_create", ArtWork.showWorkCreatePage);
	app.get("/user/:username/:worktitle", ArtWork.showWorkPage);
	// User operation
	app.post("/handle_login", User.handleLogin);
	app.post("/handle_sign_up", User.handleSignUp);
	app.post("/handle_user_query", User.handleQuery);
	app.post("/handle_user_update", User.handleUpdate);
	app.post("/handle_user_delete", User.handleDelete);

	// ArtWork operation
	app.post("/:username/handle_artwork_create", ArtWork.handleCreate);
	app.post("/:username/handle_artwork_update", ArtWork.handleUpdate);
	app.post("/:username/handle_artwork_delete", ArtWork.handleDelete);
	app.post("/handle_artwork_query", ArtWork.handleQuery);
};
