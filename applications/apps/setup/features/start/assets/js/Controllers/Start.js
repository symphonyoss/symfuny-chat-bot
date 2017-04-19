Package('Setup.Controllers', {
	Start : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();
			SETUP.events.listen('start', this.onStart.bind(this));
		},

		onStart : function()
		{
			this.model = SAPPHIRE.application.getModel('bot');
			this.model.get()
				.then(function(bot)
				{
					if (!bot) SAPPHIRE.application.showPage('create');
					else SAPPHIRE.application.showPage('edit')
				}.bind(this)).done();
		}
	})
});

SAPPHIRE.application.registerController('start', new Setup.Controllers.Start());
