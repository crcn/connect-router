var dolce = require('dolce'),
crema = require('crema');





exports.create = function(factory) {
	
	var self = {},
	_routes = dolce.collection();


	self.on = function(typeOrObj, callback) {
		
		if(typeof typeOrObj == 'object') {
			
			for(var type in typeOrObj) {
				
				self.on(type, ypeOrObj[type]);

			}

			return;
		}

		crema(typeOrObj).forEach(function(route) {

			if(_routes.contains(route.channel.paths, route.channel.tags)) throw new Error('Route ' + crema.stringifyPaths(route.channel.paths) + ' already exists');

			_routes.addRoute(route, callback);

		});

	}

	/**
	 */

	function _404(req, res) {

		res.send('404', 404);

	}

	/**
	 */

	function _request(req, res, next, chain) {
		
		var _next, current = chain.shift();

		if(chain.length) {
			
			_next = function() {
				

				_request(req, res, next, chain);

			}

		} else {
			
			_next = next;

		}

		req.params = current.params;

		current.value(req, res, _next, chain);
	}

	//sets up the routes
	factory(self);


	//the middleware for express / connect
	return function(req, res, next) {
		
		//on request, fetch the route by url, and method. TODO: make it a bit more flexible with $or
		var route = _routes.get(req.url, { method: req.method });

		//route chain does not exist? 404'd
		if(!route.chains.length) return _404(req, res);

		//otherwise, let's initialize from the first chain request
		_request(req, res, next, route.chains[0]);
	}
}