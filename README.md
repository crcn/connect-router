

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
	 * checks if a user exists
	 */

	router.on('user/exists', function(req, res, next) {
			
		//pesuedocode userExists func
		if(userExists(req.query.username)) {
			res.send('That username already exists');
			return;
		}

		next();
	});

	/**
	 * Check if the user exists before signing up
	 */

	router.on('-method=POST parseBody -> user/exists -> signup', function(req, res, next) {
		
		res.send('Successfuly signed up ');

	});

}));


app.listen(8080);
```

## Explicit Middleware

Explicit middleware is defined by using the `->` token. The basic example uses explicit middleware, but here's another example:

```javascript

router.on('validate/token', function(req, res, next) {
	
	if(!tokenValid(req.data.token)) {
		res.send('That token is invalid');
	}

	next();

});

router.on('-method=GET validate/token -> my/profile', function(req, res, next) {

	res.send('Your profile stuff');

});

```

## Implicit Middleware

Implicit middleware is used to *extend* existing routes. This is certainly useful if you want to drop in plugins which are specific to a given route. A good use case:


### beta_user.js:

```javascript

//Since we're in beta, extend the signup route. If the user has been invited, then
//go onto the ORIGINAL signup route, otherwise return an error. 
router.on('-method=POST signup/*', function(req, res, next) {
	
	if(!userInvited(req.data.signupToken)) {
		res.send('You have not been invited yet.');
		return;
	}

	next();
});

```

### user.js

```javascript
router.on('-method=POST signup', function(req, res, next) {
	
	res.send('thanks for signing up!');


});
```

## Greedy Middleware

Greedy middleware allows you to wrap around entire paths. `some/route/**` means any path *after* `**` must go through this middleware. Here's an example:

```javascript

//injected as middleware if -perm is provided. -perm tags flag that a route
//requires authorization
router.on('-perm /**', function(req, res, next) {
	
	if(isAuthorized(req.data.userId, req.last.tags.perm)) {
		res.send('Not Authorized');
		return;
	}

	next();
});


//goes through perm middleware
router.on('-perm=SUPER invite/user', function(req, res, next) {
	
	res.send('You have invited a user!');

});

//does NOT go through perm middleware
router.on('some/public/route', function(req, res, next) {
	
	res.send('You have invited a user!');

});
```

Note that greedy middleware is filterable based on the route tags. You can define anything you want. Here's another
example:

```javascript

//if POST is present, then automatically parse the body
router.on('-method=POST /**', express.parseBody());

//body is automatically parsed for us
router.on('-method=POST signup', function(req, res) {

	res.send('Thanks for signing up!');

});
```




