var express = require("express");
var path = require("path");
var Message = require("./model").Message;
var app = express();
app.use(express.static(__dirname));
app.get("/", function(req, res){
    res.sendFile(path.resolve("index.html"));
});
//http服务器
var server = require("http").createServer(app);
//得到一个io实例
var io = require("socket.io")(server);

//监听客户端请求
/**
 * 一、匿名聊天
 * 1）给表单增加提交事件，当提交表单的·时候是时候就取消默认事件，得到文件域的值，把它作为消息发送给服务器
 * 2）服务器收到消息后广播给所有的来客户端
 * 3）客户端监听服务器的消息，收到消息到取得消息内容并添加一个li到ul里
 * 二、私聊
 * 1.给用户名添加点击事件，点击用户名的时候在文本域中添加 @用户名，在输入你想私聊的内容
 * 2.把此内容发送给服务器，服务器提取你想私聊的用户和内容，然后把内容单独发给对应的用户。
 *三、数据持久化
 * 1.把消息发给服务器之后，服务器要负责存储到数据库中
 * 2.每当页面打开加载完之后都要获取历史数据，取最近20条即可。
 */



    //声明一个全局变量，key是变量名对应的socket
var clients = {};
io.on("connection", function(socket){
    //私有变量，每个客户都有自己的昵称或者用户名
    var username;
    var roomName;
    var currentRoom;
    socket.send({username : "系统", content : "欢迎光临，请输入你的昵称"});
    //监听客户端的消息
    socket.on("message", function(message){
        /*        socket.send("服务器：" + message);
         //给所有的客户端广播
         io.emit("message","消息")*/
        if(username){ //有值表示已经设置过昵称
            var reg = /@([^ ]+) (.+)/;
            var result = message.match(reg);
            if(result){//如果符合正则的要求，那么就是私聊
                var toUser = result[1];//想私聊的目标用户
                var content = result[2]; //向私聊的内容
                //向目标用户发消息
                clients[toUser].send({username, content});
            } else {
                Message.create({username, content : message}, function(err, doc){
                    //doc比对象多了两个_id createAt
                    if(currentRoom){
                        io.in(currentRoom).emit("message",doc);
                    }else{
                        io.emit("message",doc);
                    }
                });
            }

        } else {//没有值表示没有设置过昵称
            //把客户端发过来的消息当做用户名
            username = message;
            //在同户名和socket对象之间建立关联
            clients[username] = socket;
            //现在服务器向客户端发送的是对象。
            io.emit("message", {username : "系统", content : `欢迎${username}加入聊天室`})
        }
        // io.emit("message", message);
    });

    //响应客户端要求的返回历史数据的请求
    socket.on("getAllMessages", function(){
        Message.find({}).sort({createAt : -1}).limit(20).exec(function(err, docs){
            //先重新倒序，是
            docs.reverse();
            socket.emit("allMessages", docs);
        })
    });

    //加入房间  监听客户端发过来要求加入某个房间的消息
    socket.on("join", function(roomName){
        //如果当前在某个房间内的话，则退出当前房间
        if(currentRoom){
            socket.leave(currentRoom);
        }
        currentRoom=roomName;
        //让当前socket加入某个房间
        socket.join(roomName)
    })
});
server.listen(8080);



