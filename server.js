var express = require("express");
var app = express();
var port = 3939;

var fs = require("fs");

app.use(express.static(__dirname + '/'));


app.listen(port,()=>console.log(`You are listening ${port}!`));