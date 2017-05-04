Package('Bot.Services', {
	Navigation : new Class({
		implements : ['select'],
		initialize : function()
		{
			this.serviceName = 'bot:navigation';
            this.importServices = 'applications-nav,modules'.split(',');

			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			BOT.events.listen('start', this.onReady.bind(this));
		},

		select : function(id)
		{
			var options = {
				canFloat: true
			};

			this.modulesService.show('scb-setup', {title: 'Symfuny Chat Bot', icon: BOT.baseUrl + 'bot/assets/images/icon.png'}, this.serviceName, BOT.baseUrl + 'setup', options);
		},

		onStart : function(done)
		{
			var bootstrap = SYMPHONY.services.subscribe('bootstrap');

			this.importServices.each(function(service)
			{
				bootstrap.importService(service);
			}, this);

			bootstrap.exportService(this.serviceName);
			done();
		},

		onReady : function()
		{
			this.navService = SYMPHONY.services.subscribe('applications-nav');
            this.modulesService = SYMPHONY.services.subscribe('modules');
            this.navService.add('scb-setup', {title: 'Symfuny Chat Bot', icon: BOT.baseUrl + 'bot/assets/images/icon.png'}, this.serviceName);
		}
	})
});

new Bot.Services.Navigation();
