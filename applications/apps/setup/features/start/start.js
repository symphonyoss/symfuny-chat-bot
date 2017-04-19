var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var start = new Feature(app, '/setup/features/start/');

  	start.addJS(['assets/js/Controllers/Start.js', 'assets/js/Views/Start.js']);

	return Q(app);
}
