var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var script = new Feature(app, '/setup/pages/script/');

	script.addPage({
		name: 'script',
		url: 'assets/pages/script.html',
		javascript: ['assets/js/Controllers/Script.js', 'assets/js/Views/Script.js'],
		css: ['assets/css/script.css']
	});

	return Q(app);
}
