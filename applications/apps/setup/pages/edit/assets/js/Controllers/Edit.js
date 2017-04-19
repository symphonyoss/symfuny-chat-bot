Package('Setup.Controllers', {
	Edit : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'edit', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'edit', this.onShow.bind(this));
		},

		onLoad : function()
		{
			this.view = new Setup.Views.Edit();
			this.view.listen('update-click', this.onUpdate.bind(this));
			this.view.listen('run-click', this.onRun.bind(this));
			this.view.listen('pause-click', this.onPause.bind(this));
			this.botModel = SAPPHIRE.application.getModel('bot');
			this.scriptsModel = SAPPHIRE.application.getModel('scripts');
		},

		getScripts : function()
		{
			return this.scriptsModel.getScripts()
				.then(function(scripts)
				{
					this.scripts = scripts;
					return this.scriptsModel.getPublicScripts()
						.then(function(scripts)
						{
							this.publicScripts = scripts;
						}.bind(this));
				}.bind(this));
		},

		update : function(bot)
		{
			this.botModel.update(bot)
				.then(function(bot)
				{
					this.view.draw(bot, this.scripts, this.publicScripts);
				}.bind(this)).done();
		},

		onShow : function(panel, query)
		{
			this.getScripts()
				.then(function(scripts)
				{
					var bot = SETUP.bot;
					this.view.draw(bot, this.scripts, this.publicScripts)
				}.bind(this)).done();
		},

		onUpdate : function(bot)
		{
			this.update(bot);
		},

		onRun : function(bot)
		{
			bot.active = true;
			this.update(bot);
		},

		onPause : function(bot)
		{
			bot.active = false;
			this.update(bot);
		},

	})
});

SAPPHIRE.application.registerController('edit', new Setup.Controllers.Edit());
