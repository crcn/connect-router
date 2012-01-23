


module.exports = function() {
	var chars = 'abcdefghijklmnopqrstuvwxyz0122345689',
	routes = [];

	for(var i = 0; i < chars.length; i++) {
		routes.push(chars.substr(0,i).split('').join('/'));
	}

	return routes;	
}


