//  Sever --> Client 的单向通讯
var net = require('net');
const uu_request = require('./uu_request');

var chatServer = net.createServer();
var clientList = [];
var do_get_method = function(url,cb){
	uu_request.get(url, function(err, response, body){
		if (!err && response.statusCode === 200) {
			var content = JSON.parse(body);
			do_result(false, content, cb);
		} else {
			cb(true, null);
		}
	});
};
//所有post调用接口方法
var do_post_method = function(url,data,cb){
	uu_request.request(url, data, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			do_result(false, body, cb);
		} else {
			cb(true,null);
		}
	});
};
//处理结果
var do_result = function(err,result,cb){
	if (!err) {
		if (result.success) {
			cb(false,result);
		}else {
			cb(true,result);
		}
	}else {
		cb(true,null);
	}
};

var receive_gps_info = function(data,cb){
	var url = "http://127.0.0.1:18037/receive_gps_info";
	do_post_method(url,data,cb);
};

chatServer.on('connection', function(client) {
    clientList.push(client);


    client.on('data', function(data) {
        var info = {

        };
        receive_gps_info({"info":JSON.stringify(info)},function(err,rows){
            if (!err) {
                client.write('received: ok');
            }else {
                client.write('received:');
                client.write('message:');
                client.write(rows.message);
            }
        });
    });

    client.write('Hi!\n'); // 服务端向客户端输出信息，使用 write() 方法
    client.write('Bye!\n');


    // client.end(); // 服务端结束该次会话
});

chatServer.listen(9000);
