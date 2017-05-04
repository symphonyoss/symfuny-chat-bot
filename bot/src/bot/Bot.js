var api = require('symphony-api');
var Client = require('./Client');
var Runner = require('./Runner');
var ScriptModel = require('../models/ScriptModel');
var scriptModel = new ScriptModel();

class Bot {
	constructor (bot)
	{
		this.bot = bot;
		var pod = bot.podServer;
		this.urls = {
			keyUrl: 'https://' + pod + ':8444/keyauth',
			sessionUrl: 'https://' + pod + ':8444/sessionauth',
            agentUrl: 'https://' + pod + ':8444/agent',
			podUrl: 'https://' + pod + ':443/pod',
		}

		this.api = api.create(this.urls);
		this.api.setLogState(true);
	}

	updateWithScripts ()
	{
		return scriptModel.updateWithScripts(this.bot)
	}

	getInfo ()
	{
		var apiInstance = api.create(this.urls);
		apiInstance.setCerts(this.bot.auth.cert, this.bot.auth.key, this.bot.auth.passphrase);
		return apiInstance.authenticate()
			.then(function()
			{
				return apiInstance.user.me();
			}.bind(this));
	}

	start ()
	{
		this.client = new Client(this.api);
		this.api.setCerts(this.bot.auth.cert, this.bot.auth.key, this.bot.auth.passphrase);
		return this.api.authenticate()
			.then(this.updateWithScripts.bind(this))
			.then(function()
			{
				this.runner = new Runner(this.client);
				this.bot.scripts.each(function(script)
				{
					this.runner.addResponses(script.content);
				}.bind(this));

//				botAgent.setBotName(bot.name);
				this.runner.setReadDelaySeconds((this.bot.options && this.bot.options.readDelaySeconds) || 0);
				this.runner.setTypingSpeed((this.bot.options && this.bot.options.typingSpeed) || 0);
				this.runner.setSelfSpamSeconds((this.bot.options && this.bot.options.selfSpamSeconds) || 0);
				this.runner.setOtherSpamSeconds((this.bot.options && this.bot.options.otherSpamSeconds) || 0);
				this.runner.setNestTimeoutSeconds(60);
				this.runner.setSinglePost(false);

				this.runner.load();
				this.runner.run(true);
			}.bind(this)).done();;
	}

	stop()
	{
		this.api.feed.stop();
	}
}

module.exports = Bot;
