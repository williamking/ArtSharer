var express = require("express");
var path = require("path");
var app = express();

app.set("views", "./views/");
app.set("view engine", "jade");

require("./router/router")(app);

app.listen(3000, function() {
	console.log("app is listening at port 3000");
	console.log(__dirname);
});

app.use(express.static(path.join(__dirname, 'public')));