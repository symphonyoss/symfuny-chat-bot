Package('Setup.Controllers', {
	Create : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'create', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'create', this.onShow.bind(this));
		},

		onLoad : function()
		{
			this.botModel = SAPPHIRE.application.getModel('bot');
			this.view = new Setup.Views.Create();
			this.view.listen('create', this.onCreate.bind(this));
		},

		onShow : function(panel, query)
		{
			this.view.draw()
		},

		onCreate : function(cert, key, passphrase)
		{
			console.log('onCreate', cert, key, passphrase)
			this.botModel.create(cert, key, passphrase)
				.then(function(bot)
				{
					SETUP.bot = bot;
					SAPPHIRE.application.showPage('edit');
				}.bind(this))
				.fail(function(error)
				{
					this.view.error(error);
				}.bind(this)).done();
		}
	})
});

SAPPHIRE.application.registerController('create', new Setup.Controllers.Create());
