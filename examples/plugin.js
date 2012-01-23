var express = require('express'),
app = express.createServer(),
connectRouter = require('../');


app.use(connectRouter(__dirname + '/plugins'));


app.listen(8080);