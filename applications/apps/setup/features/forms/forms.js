var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var forms = new Feature(app, '/setup/features/forms/');

	forms.addJS(['assets/js/Views/Forms.js']);

	return Q(app);
}
