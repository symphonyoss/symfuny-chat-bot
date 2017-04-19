Package('Bot.Controllers', {
	Setup : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'setup', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'setup', this.onShow.bind(this));
		},

		onLoad : function()
		{
			this.view = new Bot.Views.Setup();
		},

		onShow : function(panel, query)
		{
			this.view.draw()
		},
	})
});

SAPPHIRE.application.registerController('setup', new Bot.Controllers.Setup());
