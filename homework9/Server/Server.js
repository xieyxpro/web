var http = require("http");
var fs = require("fs");
var url = require("url");
var querystring = require("querystring");

var userdata = [];		//To store users's data

function start() {
	http.createServer(function (request, response) {	//To judge the request's method
		if (request.method == "GET") {
			getInformation(request, response);
		} else if (request.method == "POST") {
			receiveInformation(request, response);
		}
	}).listen(8000);

	console.log("Server running at http://127.0.0.1:8000/");

}

function getInformation(request, response) {
	var s = url.parse(request.url).search;
	if (s != null) {
		var search = s.split("=");
		var username = search[1];	//get the username searched
		var index = 0, flag = 0;

		for (var i = 0; i < userdata.length; i++) {		//judge whether the name has been store
			if (userdata[i].username == username) {
				index = i;
				flag = 1;
				break;
			}
		}

		if (flag) {		//if so, then display his information
			displayUser(response, userdata[i]);
		} else {		//if no, then display the sign in wage
			var pathname = url.parse(request.url).pathname;
			var ext = pathname.match(/(\.[^.]+|)$/)[0];		//取得后缀名

			switch(ext) {
					case ".css":
					case ".js":
						fs.readFile("." + request.url, "utf-8", function(err, data) {
							if (err) throw err;
							else {
								response.writeHead(200, {"Content-Type": {
									".css":"text/css",
									".js":"application/javascript"}[ext]});
							}
							response.write(data);
							response.end();
						});
						break;
					case ".jpg":
						fs.readFile("." + request.url, function(err, data) {
							if (err) throw err;
							else {
								response.writeHead(200, {"Content-Type": data.type});
								response.write(data);
								response.end();
							}
						});
						break;
					default:
						fs.readFile("./index.html", "utf-8", function(err, data) {
							if (err) throw err;
							else {
								response.writeHead(200, {"Content-Type": "text/html"});
								response.write(data);
								response.end();
							}
						});
						break;
			}
		}
	} else {	//if we didn't search a name, then display the sign in wage

		var pathname = url.parse(request.url).pathname;
		var ext = pathname.match(/(\.[^.]+|)$/)[0];	//取得后缀名

		switch(ext) {
				case ".css":
				case ".js":
					fs.readFile("." + request.url, "utf-8", function(err, data) {
						if (err) throw err;
						else {
							response.writeHead(200, {"Content-Type": {
								".css":"text/css",
								".js":"application/javascript"}[ext]});
						}
						response.write(data);
						response.end();
					});
					break;
				case ".jpg":
					fs.readFile("." + request.url, function(err, data) {
						if (err) throw err;
						else {
							response.writeHead(200, {"Content-Type": data.type});
							response.write(data);
							response.end();
						}
					});
					break;
				default:
					fs.readFile("./index.html", "utf-8", function(err, data) {
						if (err) throw err;
						else {
							response.writeHead(200, {"Content-Type": "text/html"});
							response.write(data);
							response.end();
						}
					});
					break;
		}
	}
}

function receiveInformation(request, response) {	//When the form is submitted, receive data
	var postdata = "";
	request.addListener("data", function(postdataChunk) {	//数据开始传输
		postdata += postdataChunk;
	});

	request.addListener("end", function() {		//数据传输完毕
		var newdata = querystring.parse(postdata);

		for (var i = 0; i < userdata.length; i++) {		//分别判断名字、ID、电话、邮箱是否被注册过
			if (userdata[i].username == newdata.username) {
				fs.readFile("./index.html", "utf-8", function(err, data) {
					if (err) throw err;
					else {
						response.writeHeader(200, {"Content-type":"text/html"});
						response.write(data);
						response.write("<script type='text/javascript'> alert('This username has been registered!!!') </script>");
						response.end();
					}
				});
				return;
			}

			if (userdata[i].stuId == newdata.stuId) {
				fs.readFile("../index.html", "utf-8", function(err, data) {
					if (err) throw err;
					else {
						response.writeHeader(200, {"Content-type":"text/html"});
						response.write(data);
						response.write("<script type='text/javascript'> alert('This student Id has been registered!!!') </script>");
						response.end();
					}
				});
				return;
			}

			if (userdata[i].tellphone == newdata.tellphone) {
				fs.readFile("../index.html", "utf-8", function(err, data) {
					if (err) throw err;
					else {
						response.writeHeader(200, {"Content-type":"text/html"});
						response.write(data);
						response.write("<script type='text/javascript'> alert('This tellphone has been registered!!!') </script>");
						response.end();
					}
				});
				return;
			}

			if (userdata[i].mail == newdata.mail) {
				fs.readFile("../index.html", "utf-8", function(err, data) {
					if (err) throw err;
					else {
						response.writeHeader(200, {"Content-type":"text/html"});
						response.write(data);
						response.write("<script type='text/javascript'> alert('This mail has been registered!!!') </script>");
						response.end();
					}
				});
				return;
			}
		}

		userdata.push(newdata);		//如果没有注册过，则展示其信息
		displayUser(response, newdata);
	});
	
}

function displayUser(response, userInfo) {
	response.writeHead(200, "utf-8", {"Content-Type": "text/html"});
	response.write("<!DOCTYPE html>");
	response.write("<html>");
	response.write("<head>");
	response.write("<title>注册信息</title>");
	response.write("<link rel='stylesheet' type='text/css' href='style/index.css'>");
	response.write("<meta charset='utf-8'>");
	response.write("</head>");
	response.write("<body>");
	response.write("<h1>详情</h1>");
	response.write("<form action='http://127.0.0.1:8000/'' method='post'>");
	response.write("<h3>用户详情</h3>");
	response.write("用户名:<input type='text' readonly='true' value='" + userInfo.username + "'/><br><br>");
	response.write("学&nbsp&nbsp&nbsp号:<input type='text' readonly='true' value='" + userInfo.stuId + "'/><br><br>");
	response.write("电&nbsp&nbsp&nbsp话:<input type='text' readonly='true' value='" + userInfo.tellphone + "'/><br><br>");
	response.write("邮&nbsp&nbsp&nbsp箱:<input type='text' readonly='true' value='" + userInfo.mail + "'/><br><br>");
	response.write("</form>");
	response.write("</body>");
	response.write("</html>");
	response.end();
}

exports.start = start;