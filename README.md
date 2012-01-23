

## Basic Example

```javascript
var express = require('express'),
app = express.createServer(),
connectRouter = require('connect-router');

app.use(connectRouter.create(function(router) {
		
	
	//you can use existing middleware to explictly define
	//them in routes
	router.on('parseBody', express.bodyParser());

	/**
	 */

	router.on('-method=POST user/exists', function(req, res, next) {
		
		if(userExists(req.query.username)) {

			res.send('That username already exists');
			return;
			
		}

		next();
	});

	/**
	 * signs the user up
	 */

	router.on('-method=POST parseBody -> user/exists -> signup', function(req, res, next) {
		
		res.send('Successfuly signed up ');

	});

}));




app.listen(8080);
```


