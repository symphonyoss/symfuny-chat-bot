Package('Setup.Models', {
	Scripts : new Class({
		Extends : Sapphire.Model,

		initialize : function()
		{
			this.parent();
		},

		getScripts : function()
		{
			return SETUP.service.call(SETUP.urls.getBotScripts, {userId: SETUP.userId}, 'POST')
				.then(function(data) {
					return (data && data.success) ? Q(data.result) : Q.reject(data.result);
				});
		},

		getPublicScripts : function()
		{
			return SETUP.service.call(SETUP.urls.getPublicScripts, {userId: SETUP.userId}, 'POST')
				.then(function(data) {
					return (data && data.success) ? Q(data.result) : Q.reject(data.result);
				});
		},

		create : function(content, name, public)
		{
			var script = {
				content: content,
				name: name,
				public: public,
				owner: SETUP.userId,
			};

			var data = {
				script: JSON.stringify(script),
			}

			return SETUP.service.call(SETUP.urls.createScript, data, 'POST')
				.then(function(data) {
					return (data && data.success) ? Q(data.result.data) : Q.reject(data.result);
				});
		},

		save : function(script)
		{
			return SETUP.service.call(SETUP.urls.saveScript, {script: JSON.stringify(script), botId: SETUP.userId}, 'POST')
				.then(function(data) {
					return (data && data.success) ? Q(data.result.data) : Q.reject(data.result);
				});
		},

		download : function(script)
		{
			window.open(SETUP.urls.download + '?userId=' + encodeURIComponent(SETUP.userId));
			return;
		}
	})
});

SAPPHIRE.application.registerModel('scripts', new Setup.Models.Scripts());

