var Q = require('q');
var DB = require('./db');
var MongoModel = require('./MongoModel');

class BotModel extends MongoModel {
	constructor ()
	{
		super();
	}

	get (botId)
	{
		return this.getCollection('bots')
			.then(this.find.bind(this, {'botId': botId}))
			.then(function(result)
			{
				if (!result || result.length !== 1) return false;
				return result[0];
			}.bind(this));
	}

	getAllBots ()
	{
		return this.getCollection('bots')
			.then(this.find.bind(this, {}))
	}

	upsert (bot)
	{
		if (bot._id) bot._id = new ObjectID.createFromHexString(bot._id);
		return this.getCollection('bots')
			.then(function(collection)
			{
				return collection.save(bot)
					.then(function(result)
					{
						if (result.writeError) return Q.reject(new Error(result.writeError.errmsg));
						return this.get(bot.botId)
							.then(function(bot)
							{
								if (bot) return bot;
								return Q.reject(new Error('error saving bot, no bot found'));
							}.bind(this))
					}.bind(this));
			}.bind(this))
	}
}

module.exports = BotModel;

