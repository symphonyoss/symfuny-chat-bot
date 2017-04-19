var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var create = new Feature(app, '/setup/pages/create/');

	create.addPage({
		name: 'create',
		url: 'assets/pages/create.html',
		javascript: ['assets/js/Controllers/Create.js', 'assets/js/Views/Create.js'],
		css: ['assets/css/create.css']
	});

	return Q(app);
}
