Package('Bot', {
	Service : new Class({
		Extends : Sapphire.Eventer,
		Implements: [Sapphire.Services.AjaxService],

		initialize : function()
		{
			this.parent();
			this.initializeAjaxService(true);
		}
	})
});

BOT.service = new Bot.Service();
