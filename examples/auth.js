var express = require('express'),
app = express.createServer(),
connectRouter = require('../'),
appRouter = connectRouter.create(app);



appRouter.on('get hello/world', function(req, res) {
	
	console.log(req);
	
});


app.listen(8080);