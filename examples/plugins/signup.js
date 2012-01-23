exports.plugin = function(router) {
	
	router.on('-method=GET signup', function(req, res) {
		console.log("signup!")
		res.send('signup!')
	})
}