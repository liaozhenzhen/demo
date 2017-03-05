var Movie = require("../model").Movie;
var async = require("async");
var debug = require("debug")("crawl:main");
exports.movie = function(movies, callback){
    async.forEach(movies, function(item, cb){
        debug(`保存电影：${item.name}`);
        Movie.create(item, cb);
    }, callback)
};
