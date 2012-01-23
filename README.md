```javascript

var connectRouter = require('connect-router'),
express = require('express'),
app = express.createServer();


var appRouter = connectRouter.createRouter(app);


appRouter.on('get validateUser -> myProfile', function(req, res, next) {
	
});


appRouter.on('get validateUser -> my/profile', function(req, res, next) {
	
});


```