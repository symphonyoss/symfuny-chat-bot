Package('Setup.Views', {
	 Setup : new  Class({
		Extends: Sapphire.View,

		initialize : function()
		{
			this.parent();
			$('#bot-tab').click(this.fire.bind(this, 'bot-page'));
            $('#scripts-tab').click(this.fire.bind(this, 'scripts-page'));
            $('#help-tab').click(this.fire.bind(this, 'help-page'));
		}
	})
});
