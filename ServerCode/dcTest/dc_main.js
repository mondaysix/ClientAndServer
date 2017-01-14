var express = require('express');
var mysql = require('./my_sql.js');
var path = require('path');
var fs = require('fs');
var app = new express();
var app1 = new express();
var webPath = "./web";
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
//设置静态文件目录访问路径./web/
app.use(express.static(path.join(__dirname, webPath)));
app.use(express.query());
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json());
app.set('json spaces', 4);
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({
	extended: true
}));
//------------app1
app1.use(express.static(path.join(__dirname, webPath)));
app1.use(express.query());
app1.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app1.use(bodyParser.json());
app1.use(bodyParser.json({limit: "50mb"}));
app1.use(bodyParser.urlencoded({
	extended: true
}));
// app.listen('1881',function  (req,res) {
// 	// body... 
// 	var date = new Date();
// 	console.log('-----server open-----'+date);

// });
var options = {
    key: fs.readFileSync('./pem/https/server.key'),
    cert: fs.readFileSync('./pem/https/server.crt')
};
//----------https---------
var httpServer = https.createServer(options,app);
httpServer.listen('1883',function(req,res){
	var date = new Date();
	console.log('--https server open---'+date);
});
//-----------http---------
var httpServer2 = http.createServer(app1);
httpServer2.listen('1884',function(req,res){
	var date = new Date();
	console.log('--http server open---'+date);
});
//----------app-----------
app.post('/duc/customerReg/',function (req,res) {
	// body...
	customerRegister(req,res);
});
app.post('/dcu/addDevice/',function(req,res){
	console.log('------------->add device----');
	addDevice(req,res);
});
app.post('/dcu/delDevice/',function(req,res){
	delDevice(req,res);
});
app.post('/dcu/setDeviceInfo/',function(req,res){
	setDeviceInfo(req,res);
});
app.get('/dcu/getDeviceInfo/*',function(req,res){
	getDeviceInfo(req,res);
});
app.get('/dcu/getDevicesInfo/',function(req,res){
	getDevicesInfo(req,res);
});
//--------------app1
app1.get('/dcu/getDevicesInfo/',function(req,res){
	console.log('------> getDevicesInfo');
	getDevicesInfo(req,res);
});
//-------customer Register-------
var customerRegister = function(req,res){
	console.log('-----customerRegister-----');
	var info = new Object();
	if (req) {
		console.log(req.body.customerID);
		console.log(req.body.customerKey);
		
		info.status = '200';
		info.dcSign = 'customer sign success';
		res.send(info);
	}
	else{
		info.status = '202';
		console.log('===== error');
		info.dcSign='error';
		res.send(info);
	}
	
}
//------add device 
var addDevice = function (req,res) {
	// body... 
	console.log('-----addDevice-----');
	console.log(req.body);
	var info = new Object();
	var deviceID = req.body.deviceID;
	var token = req.body.token;
	var status = req.body.status;
	mysql.addDev_sql(deviceID,token,status,function(info){
			res.send(info);
	});
	console.log(req.body.deviceID);

}
//--------delete device
var delDevice = function(req,res){
	console.log('----del Device----');
	var deviceID = req.body.deviceID;
	mysql.delDev_sql(deviceID,function(info){
		res.send(info);
	});
}
//-------getDeviceInfo-----
var getDeviceInfo = function(req,res){
	console.log('-----get device info--');
	///dcu/getDeviceInfo/123
	var url = req.url;
	var deviceID = url.split('getDeviceInfo/')[1];
	mysql.getDevInfo_sql(deviceID,function(info){
		res.send(info);
	});
}
//--------getDevicesInfo-----
var getDevicesInfo = function(req,res){
	mysql.getDevsInfo_sql(function(info){
		console.log(info);
		res.send(info);
	});
}
//---------setDevicesInfo-----
var setDeviceInfo = function(req,res){
	var deviceID = req.body.deviceID;
	var status = req.body.status;
	mysql.setDevInfo_sql(deviceID,status,function(info){
		res.send(info);
	});
}