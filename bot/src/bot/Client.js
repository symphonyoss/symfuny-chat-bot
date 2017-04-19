var events = require('events');
var fs = require('fs');
var Q = require('q');

function Base64EncodeUrl(str)
{
	return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

class Client extends events
{
	constructor (api)
	{
		super();

		this.api = api;
		this.streams = {};
		this.users = {};
	}

	sayOneHello (stream)
	{
		var roomName = '';
		if (stream.streamType === 'ROOM') roomName = stream.roomAttributes.name;
		else roomName = stream.streamType;

		var data = {
			name : this.getName(),
			fullName : this.me.displayName || this.me.username,
			mention: '<mention email="' + this.me.emailAddress + '"/>',
			id: this.me.id,
			roomId: Base64EncodeUrl(stream.id),
		};

		this.emit('join', data, roomName);
	}

	sayHello (streams)
	{
		this.streams.each(function(stream) {
			this.sayOneHello(stream);
		}, this);
	}

	start ()
	{
		this.api.feed.on('messages', this.onMessages.bind(this));
		return this.api.user.me()
			.then(function(me)
			{
				this.botId = this.normalizeId(me.id);
				this.me = me;
				return this.api.feed.start()
			}.bind(this));
	}

	stop ()
	{
		this.api.feed.stop();
	}

	getName ()
	{
		return this.me.displayName.split(' ')[0];
	}

	emote (message, streamId)
	{
		this.post(message, streamId);
	}

	post (message, streamId)
	{
		try
		{
			if (message.toLowerCase().indexOf('<messageml>') === -1) message = '<messageML>' + message +'</messageML>'
			if (message.length > 10000) message = '<messageML><b>message is too big to post</b></messageML>';
			this.api.message.v2.send(streamId, 'messageml', message);
		}
		catch (e)
		{
			console.log(e.stack);
		}
	}

	normalizeId (id)
	{
		return '' + id;
	}

	getUser (id)
	{
		id = this.normalizeId(id);
		if (this.users[id]) return Q(this.users[id]);
		return this.api.user.lookup({uid: id})
			.then(function(response)
			{
				this.users[id] = response;
				return response
			}.bind(this))
	}

	getUsers (ids)
	{
		var promises = [];
		ids.each(function(id) {
			promises.push(this.getUser(id));
		}, this);

		return Q.allSettled(promises)
	}

	fixMentions (text)
	{
		var regex = /<mention.*?uid="(.*?)"/g;
		var ids = []

		var match = regex.exec(text);
		while(match && match[0] != '')
		{
			ids.push(match[1]);
			match = regex.exec(text);
		}

		return this.getUsers(ids)
			.then(function()
			{
				var xlat = {};
				ids.each(function(id)
				{
					xlat[id] = this.users[id] && this.users[id].emailAddress;
				}, this);

				Object.each(xlat, function(value, key) {
					text = text.replace(new RegExp('uid="' + key +'"', 'g'), 'email="' + value + '"');
				}, this);

				return text;
			}.bind(this));
	}

	removeTags (text, type)
	{
		var reStart = new RegExp('<' + type + '>', 'gi');
		var reStop = new RegExp('</' + type + '>', 'gi');
		var reSolo = new RegExp('<' + type + '.*?/>', 'gi');
		text = text.replace(reStart, '');
		text = text.replace(reStop, '');
		text = text.replace(reSolo, '');

		return text;
	}

	onMessages (messages)
	{
		if (!messages) return;
		messages.each(function(message)
		{
			if (message.fromUserId == this.botId) return;

			var streamId = message.streamId
			var text = message.message;

			text = text.replace(/\r/g, ' ');
			text = text.replace(/\n/g, ' ');
			text = this.removeTags(text, 'messageML');
			text = this.removeTags(text, 'b');
			text = this.removeTags(text, 'strong');
			text = this.removeTags(text, 'i');
			text = this.removeTags(text, 'em');
			text = this.removeTags(text, 'br');

			this.fixMentions(text)
				.then(function(text)
				{
					this.getUser(message.fromUserId)
						.then(function(user)
						{
							var data = {
								name : user.firstName || user.displayName || user.username,
								fullName : user.displayName || user.firstName || user.username,
								mention: '<mention email="' + user.emailAddress + '"/>',
								id: user.id,
								roomId: streamId,
							};

							console.log(data);

							this.emit('post', data, message.message, text);
						}.bind(this))
				}.bind(this)).done();;
		}, this);
	}
}

module.exports = Client;








