var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var models = new Feature(app, '/setup/features/models/');

	models.addJS(['assets/js/Models/Service.js', 'assets/js/Models/Bot.js', 'assets/js/Models/Scripts.js']);

	return Q(app);
}
