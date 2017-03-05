var express = require("express");
var Movie = require("./model").Movie;
var path = require("path");
var app = express();
//设置模板引擎
app.set("view engine", "html");
app.set("views", path.resolve("view"));
app.engine("html", require("ejs").__express);

app.get("/", function (req, res) {
    Movie.find({}, function (err, movies) {
        res.render("index", { movies });
    });
});
app.listen(80);

//# sourceMappingURL=server-compiled.js.map