var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var services = new Feature(app, '/bot/features/services/');

	services.addJS(['assets/js/Services/Bootstrap.js', 'assets/js/Services/Navigation.js']);

	return Q(app);
}
