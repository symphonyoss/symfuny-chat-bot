Package('Setup.Controllers', {
	Script : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'script', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'script', this.onShow.bind(this));
		},

		showScripts : function()
		{
			this.scriptsModel.getScripts()
				.then(function(scripts)
				{
					this.scripts = scripts;
					this.view.draw(scripts)
				}.bind(this));
		},

		onLoad : function()
		{
			this.view = new Setup.Views.Script();
			this.view.listen('new-script', this.onNewScript.bind(this));
			this.view.listen('save-script', this.onSaveScript.bind(this));
			this.view.listen('download', this.onDownload.bind(this));
			this.scriptsModel = SAPPHIRE.application.getModel('scripts');
		},

		onShow : function(panel, query)
		{
			this.scriptsModel.getScripts()
				.then(function(scripts)
				{
					this.scripts = scripts;
					this.view.draw(scripts)
				}.bind(this));
		},

		onNewScript : function(script, name)
		{
			this.scriptsModel.create(script, name, false)
				.then(function(script)
				{
					this.showScripts();
				}.bind(this))
		},

		onSaveScript : function(script)
		{
			this.scriptsModel.save(script)
				.then(function(script)
				{
					this.showScripts();
				}.bind(this))
		},

		onDownload : function()
		{
			this.scriptsModel.download()
		},
	})
});

SAPPHIRE.application.registerController('script', new Setup.Controllers.Script());
