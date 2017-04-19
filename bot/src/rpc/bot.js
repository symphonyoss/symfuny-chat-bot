var Q = require('q');
var RpcHandler =  require('sapphire-rpc').RpcHandler;
var BotModel = require('../models/BotModel');
var Bot = require('../bot/Bot');
var registry = require('../registry');

class RpcBot extends RpcHandler {
	constructor ()
	{
		super('bot', SERVER);
		this.bots = {};
		this.botModel = new BotModel();
	}

	create (channel, data)
	{
		if (channel !== 'scb') return Q(false);
		var bot = new Bot(data);
		return bot.getInfo()
			.then(function(info) {
				data.name = info.displayName;
				return this.botModel.upsert(data)
			}.bind(this));
	}

	get (channel, data)
	{
		var botId = data.botId;
		return this.botModel.get(botId)
			.then(function(bot)
			{
				return bot;
			}.bind(this));
	}

	update (channel, data)
	{
		return this.run(channel, data);
	}

	run (channel, data)
	{
		var bot = data;
		var botId = bot.botId;

		return this.botModel.upsert(bot)
			.then(function(bot) {
				registry.run(botId);
				return bot;
			}.bind(this));

	}

	pause (channel, data)
	{
		var botId = data.botId;
		if (this.bots[botId]) this.bots[botId].stop();
	}
}

var bot = new RpcBot();
