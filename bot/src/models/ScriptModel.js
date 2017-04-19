var DB = require('./db');
var Q = require('q');
var MongoModel = require('./MongoModel');
ObjectID = require('mongodb').ObjectID;

class ScriptModel extends MongoModel {
	constructor ()
	{
		super();
	}

	reset ()
	{
	}

	updateWithScripts (bot)
	{
		var find = bot.scriptLinks;

		return this.getByIds(find)
			.then(function(scripts)
			{
				var scriptIndex = {};

				scripts.each(function(script)
				{
					scriptIndex[script.id] = script;
				}, this);

				bot.scripts = [];
				bot.scriptLinks.each(function(id)
				{
					if (scriptIndex[id]) bot.scripts.push(scriptIndex[id]);
				}, this);

				return bot;
			}.bind(this));
	}

	getByIds (ids)
	{
		if (ids.length === 0) return Q([]);
		return this.getCollection('scripts')
			.then(this.find.bind(this, {id: {$in: ids}}))
	}

	getByBotId (id)
	{
		return this.getCollection('scripts')
			.then(this.find.bind(this, {botId: id}))
	}

	getByOwner (userId)
	{
		return this.getCollection('scripts')
			.then(this.find.bind(this, {owner: userId}))
	}

	getByName (name)
	{
		return this.getCollection('scripts')
			.then(this.find.bind(this, {name: name}))
	}

	getPublic ()
	{
		return this.getCollection('scripts')
			.then(this.find.bind(this, {public: true}))
	}

	getAScript (id)
	{
		return this.getCollection('scripts')
			.then(this.find.bind(this, {id: id}))
	}

	delete (scriptId)
	{
	}

	upsert (script)
	{
		if (script._id) script._id = new ObjectID.createFromHexString(script._id);

		return this.getCollection('scripts')
			.then(function(collection)
			{
				return collection.save(script)
					.then(function(result)
					{
						if (result.writeError) return Q.reject(new Error(result.writeError.errmsg));
						return this.getAScript(script.id)
							.then(function(scripts)
							{
								if (scripts && scripts.length) return scripts[0];
								return Q.reject(new Error('error saving script, no script found'));
							}.bind(this))
					}.bind(this));
			}.bind(this))
	}

	makePublic (scriptId)
	{
	}
}

module.exports = ScriptModel;
