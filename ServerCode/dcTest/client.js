var https = require('https');
var http = require('http');
var fs = require('fs');
var utils = require('./utils.js');
var httpsPost = function(data, host, path, b)
{
    var options = { 
        hostname: host, 
        port: 1883,
        path: path, 
        method: 'POST',
        rejectUnauthorized: false, 
     //   requestCert:true,
        ca:fs.readFileSync('./pem/vodafone.pem'), 
       
        headers: 
        { 
            'Content-Type':'application/json',
             'dcSign': " <customerSign> ",
             'dcVersion': "<version>"

        } 
    };

    options.agent = new https.Agent(options);
    var req = https.request(options, function (response) {
        var str = '';
        response.on('data',function(data){
            console.log('data--------->');
            console.log(data+'');
            str = str + data;
        });
        response.on('end', function () {
            console.log('end--------->');
           var body = JSON.parse(str);           
            b(status, body);
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: '+ e.message);
        req.end();        
    });
    // req.write(data);
 }
 var data = {
		customerID:'123',
		customerKey:'123'
	};
 var data1 = JSON.stringify(data,null,4);
 // httpsPost(data,'localhost','/duc/customerReg/',function(status,str){
 // 	console.log('b-------');
 //    console.log(status);
 //    console.log(str);
 // });
 utils.httpsPost(data1,'192.168.43.1','/duc/customerReg/',function(status,str){
        console.log('b----');
        console.log(status);
        console.log(str);
 })
 // utils.httpsGet('localhost','/dcu/getDeviceInfo/',function  () {
 //     // body... 

 // })