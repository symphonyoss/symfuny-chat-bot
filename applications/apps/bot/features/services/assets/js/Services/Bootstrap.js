Package('Bot.Services', {
	Bootstrap : new Class({
		implements: ['exportService', 'importService', 'getUserId'],

		initialize : function()
		{
			this.serviceName = 'bootstrap';
			this.exportServices = [this.serviceName];
			this.importServices = []

			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		exportService : function(name)
		{
			this.exportServices.push(name);
		},

		importService : function(name)
		{
			this.importServices.push(name);
		},

		getUserId : function()
		{
			return this.userId;
		},

		onStart : function(done)
		{
			SYMPHONY.remote.hello()
				.then(function(data) {
					done();
				}.bind(this))
		},

		onReady : function()
		{
			return SYMPHONY.application.register(BOT.appId, this.importServices.unique(), this.exportServices.unique())
				.then(function(response)
				{
					this.userId = response.userReferenceId;

					BOT.events.fire('start');
				}.bind(this))
				.done();
		},
	})
});

new Bot.Services.Bootstrap();
