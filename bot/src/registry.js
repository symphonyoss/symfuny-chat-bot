var Bot = require('./bot/Bot');
var BotModel = require('./models/BotModel');

class Registry {
	constructor ()
	{
		this.bots = {};
		this.botModel = new BotModel();
	}

	runBot (bot)
	{
		if (!bot) return;
		var botId = bot.botId;
		if (this.bots[botId]) this.bots[botId].stop();
		if (this.bots[botId]) delete this.bots[botId];

		if (bot.active) {
			this.bots[botId] = new Bot(bot);
			this.bots[botId].start();
		}
	}

	run (botId)
	{
		return this.botModel.get(botId)
			.then(function(bot)
			{
				this.runBot(bot);
			}.bind(this))
	}

	bootstrap ()
	{
		return this.botModel.getAllBots()
			.then(function(bots)
			{
				console.log('list', JSON.stringify(bots, null, '  '));
				bots.each(function(bot)
				{
					this.runBot(bot);
				}, this);
			}.bind(this))

	}
}

var registry = new Registry();
module.exports = registry;
