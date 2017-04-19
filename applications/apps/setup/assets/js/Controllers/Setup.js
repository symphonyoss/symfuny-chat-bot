Package('Setup.Controllers', {
	Setup : new  Class({
		Extends: Sapphire.Controller,

		initialize : function()
		{
			this.parent();
			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onStart : function(callback)
		{
			callback();
		},

		onReady : function()
		{
			this.view = new Setup.Views.Setup();

			this.view.listen('bot-page', this.onPage.bind(this, 'edit'));
			this.view.listen('scripts-page', this.onPage.bind(this, 'script'));
			this.view.listen('help-page', this.onPage.bind(this, 'help'));
		},

		onPage : function(which)
		{
			SAPPHIRE.application.showPage(which);
		}

	})
});

SAPPHIRE.application.registerController('bot', new Setup.Controllers.Setup());
