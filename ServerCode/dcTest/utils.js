var https = require('https');
var http = require('http');
var fs = require('fs');

exports.sprintf = function(format) {
    var arg = arguments;
    var i = 1;
    return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++] })
}

exports.random2=function(){
    len=2;
    var chars='ABCDEFGHJKLMNOPQRSTWXYZabcdefghijklmnoprstwxyz0123456789';
    var maxPos=chars.length;
    var str='';
    for(i=0;i<len;i++){
    str+=chars.charAt(Math.floor(Math.random()*maxPos));
    }
    return str;
}
exports.random6=function(){
    len=6;
    var chars='01238459867';
    var maxPos=chars.length;
    var str='';
    for(i=0;i<len;i++){
    str+=chars.charAt(Math.floor(Math.random()*maxPos));
    }
    return str;
}

exports.getReqIP=function(req){
    try
    {
        var ret = "";
        var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        if(ip.indexOf(":") >= 0)
        {
            var ls = ip.split(":");

            for(var i=0; i< ls.length; i++)
            {
                var s = ls[i];
                if(s.split(".").length == 4)
                    ret = s;
            }
        }
        return ret;
    }
    catch(err)
    {
        return "";
    }
}
exports.httpsPostPsb = function(data, host, path, b)
{

    var options = { 
        hostname: host, 
        port: 443,
        rejectUnauthorized: false, 
        path: path, 
        ca:fs.readFileSync('./pem/https/server.crt'), 
        method: 'POST',
        headers: {  
        'Content-Type': 'application/json'  
    } 
    };
    options.agent = new https.Agent(options);
    var req = https.request(options, function (response) {
        var str = '';
        response.on('data', function (data) {
            str = str + data;
        });
        response.on('end', function () {
            console.log("httpsPost ret: ", str);
            var status = '404';
            try{
                str=JSON.parse(str);
                if(str.status)
                    status = str.status;
            }
            catch(err){}
            
            b(status, str);
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: '+ e.message);
        b("500");
    });
    req.write(JSON.stringify(data));
    req.end();
}

exports.httpsPost = function(data, host, path, b)
{
    var options = { 
        hostname: host, 
        port: 1883,
        rejectUnauthorized: false, 
        path: path, 
        ca:fs.readFileSync('./pem/vodafone.pem'), 
        method: 'POST',
        headers: 
        {  
            'User-Agent': 'node-soap',
            'Content-Type': 'text/xml; charset=utf-8',
            'Content-Length': data.length,
            'SOAPAction': 'https://m2mprdapi.vodafone.com:11851/GDSPWebService/GetDeviceDetailsv2'
        } 
    };
    options.agent = new https.Agent(options);
    var req = https.request(options, function (response) {
        var str = '';
        response.on('data', function (data) {
            str = str + data;
            console.log(data+'');
        });
        response.on('end', function () {
            var status = '404';
            try{
                str=JSON.parse(str);
                status = str.status;
            }
            catch(err)
            {
                
            }
            
            b(status, str);
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: '+ e.message);
        b(req.statusCode);
    });
    req.write(data);
    req.end();
}
exports.httpsGet = function(host, path, b)
{
    var options = { 
        hostname: host, 
        port: 1883,
        rejectUnauthorized: false, 
        path: path, 
        method: 'GET',
    };
    console.log("<<HTTPS GET: "+host+path);
    options.agent = new https.Agent(options);
    var req = https.request(options, function (response) {
        var str = '';
        response.on('data', function (data) {
            str = str + data;
        });
        response.on('end', function () {
            var status = '404';
            try{
                var str=JSON.parse(str);
                status = str.status;
            }
            catch(err)
            {
                
            }
            
            b(status, str);
        });
    });
    req.on('error', function (e) {
        console.log('problem with https request: '+ e.message);
        b("500");
    });
    req.end();
}

exports.httpGet = function(url, b)
{
    console.log(">>>>HttpGet: ", url);
    http.get(url, function (response) 
    {
        var str = '';
        response.on('data', function (data) {
            str = str + data;
        });
        response.on('end', function () {
            b('200', str);
        });
    }).on('error', function (e) {
        console.log('problem with https request: '+ e.message);
        b("500");
    });
}

exports.httpsPut = function(data, host, path, b)
{

    var options = { 
        hostname: host, 
        port: 9553,
        rejectUnauthorized: false, 
        path: path, 
        method: 'PUT',
        headers: {  
        'Content-Type': 'application/json',
        'Authorization': 'Bearer c.JMcC50ipDGq730zvh3Aj4vUruoK5euhFwTZ4DKgrkj5cIjUg2LhwalCkgkRUicC7wI4BQmE8c5joCrxHQVjHJoHYPpxbwIxhiDIisrYhxyQjsMug3uJ2EGcZ0ny4aPq1ftVwyvMm4DTqxgU0' 
    } 
    };
    options.agent = new https.Agent(options);
    var req = https.request(options, function (response) {
        var str = '';
        response.on('data', function (data) {
            str = str + data;
        });
        response.on('end', function () {
            console.log("httpsPost ret: ",str);
            var status = '404';
            try{
                var data=JSON.parse(str);
                status = data.status;
            }
            catch(err)
            {
                
            }
            console.log(response.statusCode);
            console.log(">>>>>>>>>>>>>put: ", str);
            b(status, str);
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: '+ e.message);
        b("500");
    });
    req.write(JSON.stringify(data));
    req.end();
}









