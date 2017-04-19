var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
    var help = new Feature(app, '/setup/pages/help/');

	help.addPage({
		name: 'help',
		url: 'assets/pages/help.html',
		javascript: ['assets/js/Controllers/Help.js', 'assets/js/Views/Help.js'],
		css: ['assets/css/help.css']
	});

	return Q(app);
}
