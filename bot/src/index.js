var registry = require('./registry');
registry.bootstrap()
	.then(function()
	{
		console.log('bootstrapped');
		require('./rpc');
	}).done();
