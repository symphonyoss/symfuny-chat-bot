Package('Setup', {
	Service : new Class({
		Extends : Sapphire.Eventer,
		Implements: [Sapphire.Services.AjaxService],

		initialize : function()
		{
			this.parent();
			this.initializeAjaxService(true);
//			this.initializeSocketService(true);
//			this.start();
		},

		start : function()
		{
			this.setupSocketServer(SETUP.socketUrl);
		}
	})
});

SETUP.service = new Setup.Service();
