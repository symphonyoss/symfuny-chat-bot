var Q = require('q');
var sapphire = require('sapphire-express');

function main(req, res, app)
{
	app.addJS([
		'https://www.symphony.com/resources/api/v1.0/symphony-api.js',
	], true);

	app.addCSS([
		'/bot/assets/css/bot.css',
	]);

	app.addJS([
		'/assets/js/lib/translate.js',
		'/assets/js/lib/templates.js',
		'/bot/assets/js/Views/Bot.js',
		'/bot/assets/js/Controllers/Bot.js',
	]);

	return Q(app)
}

function use(type, name, req, res)
{
	var module = require('./' + type + '/' + name + '/' + name + '.js');
	return function(app)
	{
		return module(req, res, app);
	}
}

exports.getApplication = function(req, res)
{
	var session = req.session.get();
	var app = new sapphire.Application('BOT', req, res);

	app.setTitle('Bot');
	app.setBody('apps/bot/templates/body.html');
	app.setMaster('apps/bot/templates/master.html');
	app.addVariable('baseUrl', CONFIG.baseUrl);
	app.addVariable('appId', CONFIG.bot.appId);

	return main(req, res, app)
		.then(sapphire.features.animator.bind(sapphire.features.animator, req, res))
		.then(sapphire.features.dialogs.bind(sapphire.features.dialogs, req, res))
		.then(use('features', 'services', req, res))
		.then(function(app)
		{
			return Q(app);
		})
}
