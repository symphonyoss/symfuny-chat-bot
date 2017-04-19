var List = require('./List');
var events = require('events');

class Queue extends events {
	constructor (client)
	{
		super();
		this.client = client;
		this.readDelaySeconds = 0;
		this.typingSpeed = 0;
		this.selfSpamSeconds = 0;
		this.otherSpamSeconds = 0;

		this.queue = new List();
		this.queue.setSorted(false);
		this.queue.setTrim(false);

		this.lastPostTimes = {};

		this.lastResponseTime = 0;

		this.ihdl = setInterval(this.execute.bind(this), 1000);
	}

	stop ()
	{
		clearInterval(this.ihdl);
	}

	run (on)
	{
		this.running = on;
	}

	calculatePostDelay (post)
	{
		var seconds;

		seconds = ((post.length / 6) * 60) / this.typingSpeed || 60;
		seconds = Math.max(seconds, 5);
		return Math.min(seconds * 1000, 15000);
	}

	addToLastPostTime (user, time)
	{
		var now = Date.now();

		this.lastPostTimes[user] = this.lastPostTimes[user] || now;
		this.lastPostTimes[user] += time;
		if (this.lastPostTimes[user] < now) this.lastPostTimes[user] = now;

		return this.lastPostTimes[user];
	}

	calculateQueueTime (user, post)
	{
		var result = this.addToLastPostTime(user, this.calculatePostDelay(post));
		return result;
	}

	performTimer (item)
	{
		if (!running) return;
		this.emit('timer', item.text, item.roomId);
		this.addTimer(item.text, parseInt(item.user, 10) || 10, item.roomId);
	}

	perform (item)
	{
		if (!this.running) return;
		switch (item.type)
		{
			case 'POST':
				if (item.text !== '') this.client.post(item.text, item.roomId);
				break;
			case 'EMOTE':
				if (item.text !== '') this.client.emote(item.text, item.roomId);
				break;
			case 'COMMAND':
				this.executeCommand(item.text, item.roomId);
				break;
			case 'TIMER':
				this.performTimer(item, item.roomId);
				break;
		}
	}

	checkQueue ()
	{
		var idx;
		var item;
		var now = Date.now();

		for (idx = this.queue.count() - 1; idx >= 0; idx--)
		{
			item = this.queue.data(idx);
			if (item.timeToDequeue <= now)
			{
				this.perform(item);
				this.queue.deleteIndex(idx);
			}
		}
	}

	clearTimer (timer, roomId)
	{
		var item;

		item = this.queue.find('\u0007' + timer + ':' + roomId);
		if (item)
		{
			item.type = 'DELETE_ME';
			item.timeToDequeue = Date.now();
		}
	}

	execute ()
	{
		this.checkQueue();
	}

	clear ()
	{
		this.queue.clear();
		this.lastPostTimes = {};
		this.lastResponseTime = Date.now();
	}

	setReadDelayTime (time)
	{
		this.readDelayTime = time;
	}

	setTypingSpeed (wordsPerMinute)
	{
		this.typingSpeed = wordsPerMinute;
	}

	setSelfSpamTime (time)
	{
		this.selfSpamTime = time;
	}

	setOtherSpamTime (time)
	{
		this.otherSpamTime = time;
	}

	setNestTimeoutTime (time)
	{
		this.nestTimeoutTime = time;
	}

	clearResponded ()
	{
		this.lastResponseTime = 0;
	}

	responded ()
	{
		this.lastResponseTime = Date.now();
	}

	canRespond ()
	{
		return true;
		return Date.now() - this.lastResponseTime >= this.readDelayTime;
	}

	addPost (post, roomId)
	{
		this.queue.add(post, {text: post, user: '', type: 'POST', roomId: roomId, timeToDequeue: this.calculateQueueTime('CHATROOM', post), source: 'CHAT_SRC'});
	}

	addEmote (post, roomId)
	{
		this.queue.add(post, {text: post, user: '', type: 'EMOTE', roomId: roomId, timeToDequeue: this.calculateQueueTime('CHATROOM', post), source: 'CHAT_SRC'});
	}

	addPM (post, user, roomId)
	{
		this.queue.add(post, {text: post, user: user, type: 'PM', roomId: roomId, timeToDequeue: this.calculateQueueTime(user, post), source: 'CHAT_SRC'});
	}

	addCommand (command, roomId)
	{
		// Add to the queue
		this.queue.add(command, {text: command, user: '', type: 'COMMAND', roomId: roomId, timeToDequeue: this.calculateQueueTime('CHATROOM', command), source: 'CHAT_SRC'});
	}

	addTimer (name, intervalSec, roomId)
	{
		this.clearTimer(name, roomId);
		this.queue.add('\u0007' + name + ':' + roomId, {text: name, user: intervalSec.toString(), type: 'TIMER', roomId: roomId, timeToDequeue: Date.now() + intervalSec * 1000, source: 'CHAT_SRC'});
	}

	trackUserPost (post, user, roomId)
	{
		this.queue.add('\u0001' + user + ': ' + post, {text: post, user: user, type: 'SPAM_TRACK', roomId: roomId, timeToDequeue: Date.now() + this.otherSpamTime, source: 'CHAT_SRC'});
	}

	trackUserEmote (post, user, roomId)
	{
		this.queue.add('\u0002' + user + ': ' + post, {text: post, user: user, type: 'SPAM_TRACK', roomId: roomId, timeToDequeue: Date.now() + this.otherSpamTime, source: 'CHAT_SRC'});
	}

	trackUserPM (post, user, roomId)
	{
		this.queue.add('\u0003' + user + ' whispers ' + post, {text: post, user: user, type: 'SPAM_TRACK', roomId: roomId, timeToDequeue: Date.now() + this.otherSpamTime, source: 'PM_SRC'});
	}

	trackBotPost (post, roomId)
	{
		this.queue.add('\u0004' + post, {text: post, user: '', type: 'SPAM_TRACK', roomId: roomId, timeToDequeue: Date.now() + this.selfSpamTime, source: 'CHAT_SRC'});
	}

	trackBotEmote (post, roomId)
	{
		this.queue.add('\u0005' + post, {text: post, user: '', type: 'SPAM_TRACK', roomId: roomId, timeToDequeue: Date.now() + this.selfSpamTime, source: 'CHAT_SRC'});
	}

	trackBotPM (post, user, roomId)
	{
		this.queue.add('\u0006' + user + ' whispers ' + post, {text: post, user: '', type: 'SPAM_TRACK', roomId: roomId, timeToDequeue: Date.now() + this.selfSpamTime, source: 'CHAT_SRC'});
	}

	botPostExists (post)
	{
		return false;
		return this.queue.exist('\u0004' + post);
	}

	botEmoteExists (post)
	{
		return false;
		return this.queue.exist('\u0005' + post);
	}

	botPMExists (post, user)
	{
		return false;
		return this.queue.exist('\u0006' + user + ' whispers ' + post);
	}

	userPostExists (post, user)
	{
		return false;
		return this.queue.exist('\u0001' + user + ': ' + post);
	}

	userEmoteExists (post, user)
	{
		return false;
		return this.queue.exist('\u0002' + user + ': ' + post);
	}

	userPMExists (post, user)
	{
		return false;
		return this.queue.exist('\u0003' + user + ' whispers ' + post);
	}

	pause (which, seconds, roomId)
	{
		this.addToLastPostTime(which, seconds * 1000);
	}

	executeCommand (command)
	{
		var originalCmd = command;
		command = command.replace(/[\t ]+/g, '|');
		var parts = command.split('|');

		if (!parts.length) return;

		switch (parts[0])
		{
			case '/timer':
				if (parts.length !== 3) return;

				name = parts[1];
				value = parts[2];

				this.addTimer(name, value);
				break;
			case '/cancel':
				if (parts.length !== 2) return;
				name = parts[1];

				this.clearTimer(name);
				break;
			case '/pause':
				if (parts.length == 2) parts.push('CHATROOM');
				if (parts.length !== 3) return;

				var length = parseInt(parts[1]);
				if (isNaN(length)) return;

				this.getQueue(roomId).pause(parts[2], length);
				break;
			case '/url':
				var url = originalCmd.slice(5);
				var urlModel = new UrlModel();

				urlModel.getMessageMl(url)
					.then(function(content)
					{
						if (content)
							this.getQueue(roomId).addPost(content, roomId);
					}.bind(this))
					.fail(function(error)
					{
					}.bind(this));
		}
	}
}

module.exports = Queue;
