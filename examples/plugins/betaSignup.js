exports.plugin = function(router) {

	router.on('-method=GET signup/*', function(req, res, next) {
		console.log('check if user is invited')
		next();
	})
}