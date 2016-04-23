var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var multer = require("multer");
var path = require("path");
var cookieParser = require("cookie-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer({
	dest: "public/imgs/"
}).single("img"));
app.use(session({
	secret : "this is my secret",
	name: 'secret_cookie',
	resave: true,
	saveUninitialized: true
}));

var db = require('./model/db');
var user = require('./model/users');
var artWork = require('./model/artworks');

app.set("views", "./views/");
app.set("view engine", "jade");

require("./router/router")(app);

app.listen(3000, function() {
	console.log("app is listening at port 3000");
	console.log(__dirname);
});

app.use(express.static(path.join(__dirname, 'public')));