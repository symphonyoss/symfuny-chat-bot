var events = require('events');

var Engine = require('./Engine');
var BotQueue = require('./Queue');
var Worker = require('./Worker');

String.prototype.splice = function (index, count, add) { return this.slice(0, index) + (add || "") + this.slice(index + count); }

var TITLE = 'Symphony Chat Bot';
var VERSION = '0.1.0';
var COPYRIGHT = '';

class Runner extends events
{
	constructor (client)
	{
		super();
		this.client = client;
		this.client.on('post', this.onPost.bind(this));
		this.client.on('join', this.onRoomJoin.bind(this));
		this.users = {};

		this.engine = new Engine();
		this.files = [];
		this.responses = [];
		this.queues = {};
	}

	setBotName (name)
	{
		this.name = name;
		this.engine.setBotName(name);
	}

	setReadDelaySeconds (seconds)
	{
		this.readDelay = seconds;
		Object.each(this.queues, function(queue) {
			queue.setReadDelayTime(seconds * 1000);
		}, this);
	}

	setTypingSpeed (wordsPerMinute)
	{
		this.typingSpeed = wordsPerMinute;
		Object.each(this.queues, function(queue) {
			queue.setTypingSpeed(wordsPerMinute);
		}, this);
	}

	setSelfSpamSeconds(seconds)
	{
		this.selfSpamSeconds = seconds;
		Object.each(this.queues, function(queue) {
			queue.setSelfSpamTime(seconds * 1000);
		}, this);
	}

	setOtherSpamSeconds(seconds)
	{
		this.otherSpamSeconds = seconds;
		Object.each(this.queues, function(queue) {
			queue.setOtherSpamTime(seconds * 1000);
		}, this);
	}

	setNestTimeoutSeconds (seconds)
	{
		this.nestTimeoutSeconds = seconds;
		Object.each(this.queues, function(queue) {
			queue.setNestTimeoutTime(seconds * 1000);
		}, this);
	}

	setSinglePost (on)
	{
		this.singlePost = on;
	}

	clear ()
	{

		this.engine.clear();
		this.files = [];
	}

	clearQueue ()
	{
		Object.each(this.queues, function(queue) {
			queue.clear();
		}, this);
	}

	clearUsers ()
	{
		this.users = {};
	}

	addResponses (responses)
	{
		this.responses.push(responses);
	}

	addResponseFile (filename)
	{
		this.files.push(filename);
	}

	load (onError)
	{
		var idx;

		this.engine.clear();

		this.responses.each(function(responses)
		{
			this.engine.addResponses(responses, onError);
		}, this);

	}

	stop ()
	{
		this.running = false;
		this.client.stop();
		Object.each(this.queues, function(queue, idx) {
			queue.stop();
			delete this.queues[idx];
		}, this);
	}

	run ()
	{
		var idx;
		var user;

		this.running = true;
		this.client.start();
		Object.each(this.queues, function(queue)
		{
			queue.run(true);
		}, this);
	}

	getQueue (roomId) {
		if (!this.queues[roomId])
		{
			this.queues[roomId] = new BotQueue(this.client);
			this.queues[roomId].on('timer', this.onTimer.bind(this));
			this.queues[roomId].run(true);
		}

		var queue = this.queues[roomId];
		queue.setReadDelayTime(this.readDelay * 1000);
		queue.setTypingSpeed(this.typingSpeed);
		queue.setSelfSpamTime(this.selfSpamSeconds * 1000);
		queue.setOtherSpamTime(this.otherSpamSeconds * 1000);

		return queue;
	}

	onRoomJoin (data, roomName)
	{
		var roomId = data.roomId;

		var queue = this.getQueue(roomId).clearResponded();

		this.postCount = 'ALWAYS_RESPOND';
		var response = new Worker('', this.engine, queue, this.postCount);
		response.run(['ENTER'], true, roomName, data);

		this.engine.checkResponses(['ENTER'], true, roomName, this.standardResponseHandler.bind(this), data);
	}

	onUserEnter (userName, roomId)
	{
		var name = userName;
		var respondedJ;
		var respondedH;
		var data = {name: name, roomId: roomId};

		this.postCount = 'ALWAYS_RESPOND';
		name = userName;

	// Can we respond to this event
		if (!this.running) return;

		var response = new Worker('', this.engine, queue, postCount);
		respondedJ = response.run(['JOIN'], false, name, data);
		respondedH = response.run(['HERE'], false, name, data);

		if (respondedJ || respondedH) this.getQueue(roomId).responded();
	}

	onUserExit (userName, roomId)
	{
		var name = userName;
		var data = {name: name, roomId: roomId};

		if (!userName) return;

		this.postCount = 'ALWAYS_RESPOND';

		var queue = this.getQueue(roomId);

	// Can we respond to this event
		if (this.running)
		{
			var response = new Worker('', this.engine, queue, this.postCount);
			if (response.run(['EXIT'], false, name, data))
				queue.responded();
		}

	// Remove the user
		delete this.users[userName];
	}

	onUserPresent (userName, roomId)
	{
		var name = userName;
		var data = {name: name, roomId: roomId};

	// force responses, even after other potential user presents
		var queue = this.getQueue(roomId);
		queue.clearResponded();

		this.postCount = 'ALWAYS_RESPOND';

	// Can we respond to this event
		if (!this.running) return;

		var response = new Worker('', this.engine, queue, this.postCount);
		if (response.run(['EXIT'], false, name, data))
	// Respond
		if (response.run(['HERE'], false, name, data))
			queue.responded();
	}

	onPost (data, encodedPost, post)
	{
		var name = data.name;
		var user = data.id;
		var roomId = data.roomId;
		var respondedU;
		var respondedT;
		var responded;

		respondedU = false;
		respondedT = false;

		this.postCount ++;

		var queue = this.getQueue(roomId);
		queue.responded();
		queue.trackUserPost(post, user);

		if (!this.running) return;

		var response = new Worker('', this.engine, queue, this.postCount);

	// First check for user posted
		respondedU = response.run(['USER'], false, name, data);
		respondedT = response.run(['TEXT', 'CONVERSATION'], false, post, data);

		var responded = respondedU || respondedT;

	// If we got no response, do a last chance response
		if (!responded) responded = response.run(['OTHERWISE'], false, post, data);

		if (responded) queue.responded();
	}

	onEmote (user, post, roomId)
	{
		var name = user;
		var respondedU;
		var tespondedT;
		var responded;
		var data = {name: name, roomId: roomId};

		respondedU = false;
		respondedT = false;

		this.postCount++;

		var queue = this.getQueue(roomId);
		queue.trackUserEmote(post, user);

		if (this.running) return;

		var response = new Worker('', this.engine, queue, this.postCount);

	// First run through for which user posted and post content
		respondedU = response.run(['USER'], false, name, data);
		respondedT = response.run(['TEXT', 'CONVERSATION'], false, post, data);

		var responded = respondedU || respondedT;

	// If we got no response, do a last chance response
		if (!responded) responded = response.run(['OTHERWISE'], false, post, data);

		if (responded) queue.responded();
	}

	onLogout ()
	{
	}

	onLogin ()
	{
	}

	onConnect ()
	{
	}

	onDisconnect ()
	{
	}

	onTimer (timer, roomId)
	{
		var response = new Worker('', this.engine, queue, this.postCount);
		response.run(['CHRON'], true, timer, {name: this.name, roomId: roomId});
	}
}

module.exports = Runner;
