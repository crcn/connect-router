var express = require('express'),
app = express.createServer(),
connectRouter = require('../');




app.use(connectRouter(function(router) {
		
	router.on('-method=GET hello/world', function(req, res, next) {
		
		res.send('hello');
	});

	return;

	router.on('parseBody', express.bodyParser());
	router.on('parseCookies', express.cookieParser());


	router.on('-method=GET parseCookies -> authorize', function(req, res, next) {
		
		console.log('Authorize');

		next();
	});

	router.on('/**', function(req, res, next) {
		
		console.log('some greedy middleware');

		next();

	});


	router.on('-method=GET authorize -> hello/:name', function(req, res, next) {
		
		console.log("DONE");
		res.send(req.params.name);
	});

}));





app.listen(8090);