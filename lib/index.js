var dolce = require('dolce'),
crema = require('crema');





exports.create = function() {
	
	var self = {},
	_routeCollections = {};


	self.on = function(typeOrObj, callback) {
		
		if(typeof typeOrObj == 'object') {
			
			for(var type in typeOrObj) {
				
				self.on(type, ypeOrObj[type]);

			}

			return;
		}

		crema(typeOrObj).forEach(function(route) {

			_collection(route.type).addRoute(route, callback);

		});

	}

	function _collection(type) {
		type = type.toUpperCase();
		return _routeCollections[type] || (_routeCollections[type] = dolce.collection());
	}



	return function(req, res, next) {
		
		var route = _collection(req.method).get(req.url);

		console.log(route);
	}
}