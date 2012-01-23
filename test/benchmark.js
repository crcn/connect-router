var express = require('express'),
app1 = express.createServer(),
app2 = express.createServer(),
connectRouter = require('../'),
routes = require('./benchmark-routes')();







app1.use(connectRouter(function(router) {

	for(var i = routes.length; i--;) {

		var mw = i != 0 ? routes.slice(0, i-1) : [];

		mw.push(routes[i]);


		router.on('-method=GET ' + mw.join(' -> '), function(req, res, next) {
			
			if(req.hasNext) {
				next();
				return;
			}

			res.send('DONE');
		});
	}


}));


var thru = {};

for(var i = 0; i < routes.length; i++) {

	var fns = [], middleware = i != 0 ? routes.slice(0, i-1) : [], croute;

	var uri = routes[i];

	middleware.forEach(function(mw) {
		fns.push(thru[mw]);
	});

	thru[uri] = function(req, res, next) {

		next();

	}

	fns.push(thru[uri]);

	app2.get('/'+uri, fns, function(req, res) {
		res.send('DONE')
	});	
}





//connect-router
app1.listen(8090);


app2.listen(8091);