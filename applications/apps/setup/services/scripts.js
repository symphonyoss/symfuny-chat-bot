var Q = require('q');
var Service = require('sapphire-express').Service;
var Archiver = require('archiver');

BotService = new Class({
	Implements : [Service],

	initialize : function()
	{
		this.export('getBotScripts', module);
		this.export('getPublicScripts', module);
		this.export('saveScript', module);
		this.export('createScript', module);
		this.export('download', module);

		this.addCSRFException('download');
	},

	verify : function(req, res)
	{
		return true;
	},

	getBotScripts : function(req, res)
	{
		var session = req.session.get();
		var id = req.body.botId;

		return SERVER.ask('scb', 'script', 'getBotScripts', {botId: id})
			.then(function(scripts)
			{
				return Q({success: true, result: scripts});
			}.bind(this));
	},

	getPublicScripts : function(req, res)
	{
		var session = req.session.get();
		var id = req.body.userId;

		return SERVER.ask('scb', 'script', 'getPublicScripts', {})
			.then(function(scripts)
			{
				return Q({success: true, result: scripts});
			}.bind(this))
	},

	createScript : function(req, res)
	{
		var session = req.session.get();
		var script = JSON.parse(req.body.script);

		return SERVER.ask('scb', 'script', 'createScript', script)
			.then(function(script)
			{
				return Q({success: true, result: script});
			}.bind(this));
	},

	saveScript : function(req, res)
	{
		var script = JSON.parse(req.body.script);

		return SERVER.ask('scb', 'script', 'saveScript', script)
			.then(function(script)
			{
				return Q({success: true, result: script});
			}.bind(this));
	},

	download : function(req, res)
	{
		var session = req.session.get();
		var id = req.query.userId;

		return SERVER.ask('scb', 'script', 'getByOwner', script)
			.then(function(scripts)
			{
				res.writeHead(200, {
					'Content-Type': 'application/zip',
					'Content-disposition': 'attachment; filename=bot_scripts.zip'
				});

				var zip = new Archiver('zip');
				zip.on('end', function()
				{
//					res.end();
					console.log('ended');
					return Q(null);
				}.bind(this));
				zip.pipe(res);

				console.log(scripts);
				scripts.each(function(script)
				{
					var filename = script.name.toLowerCase().replace(/ /g, '_') + '.brf';
					zip.append(script.content, {name: filename});
				}, this);

				zip.finalize();
			}.bind(this))
	}
});

new BotService();
