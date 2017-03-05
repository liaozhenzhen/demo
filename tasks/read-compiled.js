//传入url地址返回对象数组
var request = require("request");
var iconv = require("iconv-lite");
var cheerio = require("cheerio");
var debug = require("debug")("crawl:main");
exports.movie = function (url, callback) {
    //请求网址内容
    request({ url, encoding: null }, function (err, response, body) {
        //实现
        body = iconv.decode(body, "gbk");
        var $ = cheerio.load(body);
        var movies = [];
        $(".keyword .list-title").each(function () {
            //把当前对象转成jQuery对象
            var $me = $(this);
            //声明一个电影对象 一个是标签文本对象的电影名称，一个是href属性执行向url地址
            var movie = {
                name: $me.text(),
                url: $me.attr("href")
            };
            debug(`读到电影：${movie.name}`);
            movies.push(movie);
        });
        callback(err, movies);
    });
};
/*
exports.movie("http://top.baidu.com/buzz?b=26&c=1&fr=topcategory_c1", function(err, result){
    console.log(result);

});*/

//# sourceMappingURL=read-compiled.js.map