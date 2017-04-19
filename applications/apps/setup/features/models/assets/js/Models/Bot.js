Package('Setup.Models', {
	Bot : new Class({
		Extends : Sapphire.Model,

		initialize : function()
		{
			this.parent();
		},

		get : function()
		{
			var data = {
				botId: SETUP.userId
			};

			this.botId = SETUP.userId;

			return SETUP.service.call(SETUP.urls.getBot, data)
				.then(function(response) {
					this.bot = response.result;
					SETUP.bot = this.bot;
					return response.result;
				}.bind(this));
		},

		create : function(certPem, keyPem, passphrase)
		{
			var bot = {
				auth: {
					cert: certPem,
					key: keyPem,
					passphrase: passphrase,
				},
				botId: SETUP.userId,
				ownerId: SETUP.userId,
				scriptLinks : [],
			};

			return SETUP.service.call(SETUP.urls.createBot, {bot: JSON.stringify(bot)}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					this.bot = data.result;
					SETUP.bot = this.bot;
					return this.bot;
				}.bind(this));
		},

		update : function(bot)
		{
			return SETUP.service.call(SETUP.urls.updateBot, {bot: JSON.stringify(bot)}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					this.bot = data.result;
					SETUP.bot = this.bot;
					return this.bot;
				}.bind(this));
		}
	})
});

SAPPHIRE.application.registerModel('bot', new Setup.Models.Bot());
