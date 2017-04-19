Package('Setup.Controllers', {
	Forms : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onReady : function()
		{
		}
	})
});

SAPPHIRE.application.registerController('forms', new Setup.Controllers.Forms());
