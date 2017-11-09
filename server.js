'use strict';

var express = require("express");

var app = express();
var port = 8080;

app.disable('etag');
app.use('/', express.static(__dirname + '/public/'));
app.listen(port);

console.log("Script started. Head over to http://localhost:"+port+ " on your browser");