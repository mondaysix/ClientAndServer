var mysql = require('mysql');

var conn = mysql.createConnection({
	host:'localhost',
	user:'lucky',
	password:'ecjtuoybm',
	database:'dctest',
	port:3306
});
//--------数据库连接
conn.connect(function(err){
	var date = new Date();
	if (err) {
		console.log(err);
	}
	else 
		console.log('connect database success------'+date);
});
//---------add Device------------
exports.addDev_sql = function(deviceID,token,status,b){
	var sql = 'insert into deviceinfo(deviceID,token,status) values('+deviceID+','+token+','+status+')';
	console.log(sql);
	var info = new Object();
	conn.query(sql,function(err,res){
		if (err) {
			console.log('----->'+err);
			info.status = 202;

			b(info);
		}
		else {
			console.log('----insert success');
			info.status = 200;
			b(info);
		}
	});

};
//------------delete device------
exports.delDev_sql = function(deviceID,b){
	var sql = 'delete from deviceinfo where deviceID='+deviceID;
	console.log(sql);
	var info = new Object();
	conn.query(sql,function(err,res){
		if (err) {
			console.log(err);
			info.status = 202;
			b(info);
		}
		else {
			console.log('delete success');
			info.status = 200;
			b(info);
		}
	});
}
//-----------select device-----------
exports.getDevInfo_sql = function(deviceID,b){
	var sql = 'select * from deviceinfo where deviceID='+deviceID;
	var info = new Object();
	conn.query(sql,function(err,res){
		if (err) {
			info.status = '202';
			info.data = '{}';
			b(info);
			console.log(err);
		}
		else {			
			info.status = '200';	
			var deviceinfo={};
			var devInfo = res[0];
			console.log(devInfo);
			console.log(res);
			deviceinfo.deviceID = devInfo.deviceID;
			deviceinfo.status = devInfo.status;
			info.data = deviceinfo;
			b(info);
		}
	});
}
//------select devices-----
exports.getDevsInfo_sql = function(b){
	var sql = "select * from deviceinfo";
	var info = new Object();
	conn.query(sql,function (err,res) {
		// body... 
		if(err){
				info.status = '202';
				info.data = [];
				b(info);
		}else {
			info.status = '200';
			var arr = new Array();
			for(var i in res){
				var device = res[i];
				var devObj = {};
				devObj.deviceID = device.deviceID;
				devObj.status = device.status;
				arr.push(devObj);
			}
			info.data = arr;
			b(info);
		}
	});
}
exports.setDevInfo_sql = function  (deviceID,status,b) {
	// body... 
	var sql = 'update deviceinfo set status='+status+' where deviceID='+deviceID;
	console.log(sql);
	var info = new Object();
	conn.query(sql,function(err,res){
		if (err) {
			info.status= '202';
			b(info);
		}else {
			info.status= '200';
			b(info);
		}
	});
}
