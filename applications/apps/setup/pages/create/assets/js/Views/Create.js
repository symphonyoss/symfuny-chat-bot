Package('Setup.Views', {
	Create : new Class({
		Extends : Sapphire.View,

		initialize : function()
		{
			this.parent();
			$('#create-bot').click(this.onCreateClick.bind(this));
		},

		draw : function()
		{
		},

		error : function(text)
		{
			if (text) $('#create-page').addClass('general-error');
			else $('#create-page').removeClass('general-error');

			$('#general-error-text').text(text);
		},

		onCreateClick : function()
		{
			this.error();
			var cert = $('#bot-chain-input').val();
			var key = $('#bot-key-input').val();
			var passphrase = $('#passphrase-input').val();

			this.fire('create', cert, key, passphrase);
		},

	})
});
