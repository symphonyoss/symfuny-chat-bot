var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var setup = new Feature(app, '/bot/pages/setup/');

	setup.addPage({
		name: 'setup',
		url: 'assets/pages/setup.html',
		javascript: ['assets/js/Controllers/Setup.js', 'assets/js/Views/Setup.js'],
		css: ['assets/css/setup.css']
	});

	return Q(app);
}
