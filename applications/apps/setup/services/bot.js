var Q = require('q');
var Service = require('sapphire-express').Service;
var uuid = require('node-uuid');

var urlConfig = CONFIG.setup.urlConfig;

BotService = new Class({
	Implements : [Service],

	initialize : function()
	{
		this.export('getBot', module);
		this.export('updateBot', module);
		this.export('createBot', module);
		this.podServer = CONFIG.setup.podServer;
	},

	verify : function(req, res)
	{
		return true;
	},

	getBot : function(req, res)
	{
		var session = req.session.get();
		var id = req.body.botId;

		return SERVER.ask('scb', 'bot', 'get', {botId: id})
			.then(function(bot)
			{
				return Q({success: true, result: bot});
			}.bind(this));
	},

	createBot : function(req, res)
	{
		var botJSON = req.body.bot;
		var bot = JSON.parse(botJSON);

		bot.podServer = this.podServer
		bot.options = bot.options || {
			readDelaySeconds: 5,
			typingSpeed: 60,
			selfSpamSeconds: 10,
			otherSpamSeconds: 10,
			singlePost : false,
		};

		return SERVER.ask('scb', 'bot', 'create', bot)
			.then(function(bot)
			{
				return Q({success: true, result: bot});
			}.bind(this));
	},

	updateBot : function(req, res)
	{
		var botJSON = req.body.bot;
		var bot = JSON.parse(botJSON);

		return SERVER.ask('scb', 'bot', 'update', bot)
			.then(function(bot)
			{
				return Q({success: true, result: bot});
			}.bind(this));
	}
});

new BotService();
