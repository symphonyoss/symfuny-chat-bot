var Q = require('q');
var sapphire = require('sapphire-express');
require('./rpc');
function main(req, res, app)
{
	app.addJS([
		'https://www.symphony.com/resources/api/v1.0/symphony-api.js',
	], true);

	app.addCSS([
		'https://www.symphony.com/resources/api/v1.1/symphony-style.css',
	], true);

	app.addCSS([
		'/setup/assets/css/setup.css',
		'/setup/assets/css/flex.css',
	]);

	app.addJS([
//		'/socket.io/socket.io.js',
		'/assets/js/lib/translate.js',
		'/assets/js/lib/templates.js',
		'/assets/js/lib/ajax-service.js',
//		'/assets/js/lib/socket-service.js',
		'/setup/assets/js/Views/Setup.js',
		'/setup/assets/js/Controllers/Setup.js',
		'/setup/assets/js/3rdParty/ace/ace.js',
		'/setup/assets/js/3rdParty/jquery-sortable.js',
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
	var app = new sapphire.Application('SETUP', req, res);

	app.setTitle('Setup');
	app.setBody('apps//setup/templates/body.html');
	app.setMaster('apps//setup/templates/master.html');
	app.addVariable('baseUrl', CONFIG.baseUrl);
	app.addVariable('appId', CONFIG.bot.appId);
	app.addVariable('socketPort', process.env.socketPort);
	app.addVariable('socketUrl', CONFIG.baseSocketUrl + ':' + process.env.socketPort);
	app.addUrl('getBot', '/setup/services/bot/getBot');
	app.addUrl('createBot', '/setup/services/bot/createBot');
	app.addUrl('updateBot', '/setup/services/bot/updateBot');
	app.addUrl('getBotScripts', '/setup/services/scripts/getBotScripts');
	app.addUrl('getPublicScripts', '/setup/services/scripts/getPublicScripts');
	app.addUrl('saveScript', '/setup/services/scripts/saveScript');
	app.addUrl('createScript', '/setup/services/scripts/createScript');
	app.addUrl('saveScript', '/setup/services/scripts/saveScript');
	app.addUrl('download', '/setup/services/scripts/download');

	return main(req, res, app)
		.then(sapphire.features.animator.bind(sapphire.features.animator, req, res))
		.then(sapphire.features.dialogs.bind(sapphire.features.dialogs, req, res))
		.then(use('features', 'forms', req, res))
		.then(use('features', 'services', req, res))
		.then(use('features', 'models', req, res))
		.then(use('features', 'start', req, res))
		.then(use('pages', 'create', req, res))
		.then(use('pages', 'edit', req, res))
		.then(use('pages', 'script', req, res))
		.then(use('pages', 'help', req, res))
		.then(function(app)
		{
			return Q(app);
		})
}
