var dolce = require('dolce'),
crema = require('crema'),
haba = require('haba');





module.exports = function() {
	
	var self = {},
	_routes = dolce.collection(),
	plugins = Array.apply(null, arguments);





	self.on = function(typeOrObj, callback) {
		
		if(typeof typeOrObj == 'object') {
			
			for(var type in typeOrObj) {
				
				self.on(type, ypeOrObj[type]);

			}

			return;
		}

		crema(typeOrObj).forEach(function(route) {

			if(_routes.contains(route.channel, route.channel.tags)) throw new Error('Route ' + crema.stringifyPaths(route.channel.paths) + ' already exists');

			_routes.add(route, callback);

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

		req.hasNext = !!chain.length;

		if(req.hasNext) {
			
			_next = function() {
				

				_request(req, res, next, chain);

			}

		} else {
				
			//last next is 404
			_next = next;

		}


		req.params = current.params;

		current.value(req, res, _next, chain);
	}

	var pluginLoader = haba.loader().options(self, true);

	plugins.forEach(function(plugin) {
		
		if(typeof plugin == 'string') {

			pluginLoader.require(plugin);

		} else {
			
			//sets up the routes
			plugin(self);
		}

	});

	pluginLoader.init();
	




	//the middleware for express / connect
	return function(req, res, next) {
		
		//on request, fetch the route by url, and method. TODO: make it a bit more flexible with $or
		var route = _routes.get(crema.parseChannel(req.url), { method: req.method });

		//route chain does not exist? 404'd
		if(!route.chains.length) return _404(req, res);

		req.last = route.chains[route.chains.length - 1];

		//otherwise, let's initialize from the first chain request
		_request(req, res, next, route.chains[0]);
	}
}