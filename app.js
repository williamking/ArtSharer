
var express = require("express");
var app = express();

app.set("views", "./views/");
app.set("view engine", "jade");

app.get('/', function(req, res) {
	res.render('index', {title: "ArtSharer"});
	/*res.send("Hello World!");*/
});

app.listen(3000, function() {
	console.log("app is listening at port 3000");
});