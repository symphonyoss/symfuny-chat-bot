var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var edit = new Feature(app, '/setup/pages/edit/');

	edit.addPage({
		name: 'edit',
		url: 'assets/pages/edit.html',
		javascript: ['assets/js/Controllers/Edit.js', 'assets/js/Views/Edit.js'],
		css: ['assets/css/edit.css']
	});

	return Q(app);
}
