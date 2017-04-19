
class Worker
{
	constructor (workStr, engine, queue, postCount)
	{
		this.workStr = workStr
		this.engine = engine;
		this.queue = queue;
		this.postCount = postCount;
	}

	replaceHandler (responseStr, response, start, prepId, data)
	{
		var idx;
		var name = data.name;
		var roomId = data.roomId;
		var length = response.length(prepId, start);

		idx = start + this.delta;
		this.workStr = this.workStr.splice(idx, length, responseStr);
		this.delta = this.delta + responseStr.length - length;
	}

	nameReplaceHandler (responseStr, response, start, match, data)
	{
		var idx;
		var name = data.name;
		var roomId = data.roomId;
		var length = response.length(prepId, start);

		idx = start + this.delta;
		this.workStr = this.workStr.splice(idx, length);

	// If the string %name appears in the response, then replace that with the original name
		var nameStr = new RegExp('%name', 'g');
		responseStr = responseStr.replace(nameStr, name);

		this.workStr = this.workStr.splice(idx, 0, responseStr);
		this.delta = this.delta + responseStr.length - length;
	}

	applyDefines (responseStr, user)
	{
		responseStr = this.engine.replaceDefines(responseStr);
		return responseStr;
	}

	applyGroupsSingle (responseStr, data)
	{
		var replace;
		var regExp;
		var idx;
		var type;
		var name = data.name;
		var roomId = data.roomId;

		function oneRegEx()
		{
			var match = regExp.exec(responseStr);
			if (!match) return false;

			this.workStr = match[1];
			replace = this.workStr;

			if (match && match[1]) {
				this.engine.checkResponses([type], false, replace, this.replaceHandler.bind(this), data);
			}

			responseStr = responseStr.splice(regExp.lastIndex - match[0].length, match[0].length, this.workStr);
			return true;
		}

		for (var idx = 0; idx < 10; idx++)
		{
			var regExp = new RegExp('%' + idx + '\\(([^)].*?)\\)', 'g');
			var type = 'MACRO' + idx;

			while(oneRegEx.call(this));
		}

		return responseStr;
	}

	applyGroups (responseStr, data)
	{
		var before;
		var tries;
		var changes;

		tries = 0;
		changes = true;
		this.delta = 0;
		while (tries < 10 && changes)
		{
			before = responseStr;
			responseStr = this.applyGroupsSingle(responseStr, data);
			changes = responseStr != before;
			tries++;
		}

		return responseStr;
	}

	morphName (user, data)
	{
		console.log('morphName', user);
	// Keep applying to the name?
		var tries = 0;
		this.workStr = user;
		var name = '';

		while (name !== this.workStr && tries < 20)
		{
			name = this.workStr;
			this.delta = 0;
			this.engine.checkResponses(['NAME'], false, name, this.nameReplaceHandler.bind(this), data);
			tries++
		}

		name = this.workStr;

	// Apply groups, after the fact. !Pending: should this be inside the above loop?
		name = this.applyGroups(name, user);

	// If the name ended up empty, just restore it
		if (name === '') name = user;

		return name;
	}

	applyData (responseStr, data)
	{
		console.log('applyData', responseStr, data)
		var name = data.name;

		if (responseStr.indexOf('%name') !== -1) name = this.morphName(name, data);

		responseStr = responseStr.replace(/%name\b/g, name);
		responseStr = responseStr.replace(/%thread\b/g, data.roomId);
		responseStr = responseStr.replace(/%mention\b/g, data.mention);
		responseStr = responseStr.replace(/%userid\b/g, data.id);
		responseStr = responseStr.replace(/%fullname\b/g, data.fullName);

		return responseStr;
	}

	applyTypo (responseStr, data)
	{
		this.workStr = responseStr;
		this.delta = 0;
		this.engine.checkResponses(['TYPO'], false, responseStr, this.replaceHandler.bind(this), data);
		return this.workStr;
	}

	applyMTypo (responseStr, data)
	{
		var changes;
		var tries;

		tries = 0;
		changes = true;
		while (changes && tries < 10)
		{
			this.workStr = responseStr;
			this.delta = 0;
			this.engine.checkResponses(['MTYPO'], false, responseStr, this.replaceHandler.bind(this), data);
			changes = responseStr !== this.workStr;
			responseStr = this.workStr;
			tries++;
		}

		return responseStr;
	}

	applyStandardMacros (responseStr, data)
	{
//		responseStr = responseStr.replace(/%title/g, TITLE);
//		responseStr = responseStr.replace(/%version/g, VERSION);
//		responseStr = responseStr.replace(/%copyright/g, COPYRIGHT);
		responseStr = responseStr.replace(/%time/g, new Date().toLocaleTimeString());
		responseStr = responseStr.replace(/%date/g, new Date().toLocaleDateString());
		responseStr = responseStr.replace(/%fullname/g, data.name);

		return responseStr;
	}

	handleCommand (command, data)
	{
	// a double '/' means to execute now, otherwise it is queued up
		if (command.slice(0, 2) === '//')
		{
			command = command.slice(1);
			this.queue.executeCommand(command, data);
		}
		else
		{
			this.queue.addCommand(command, data);
		}
	}

	handleOneSubPost (post, data, canPost)
	{
		console.log('handleOneSubPost', post, data, canPost)
		var name = data.name;
		var roomId = data.roomId;

	// If we have an empty post, then it is just there for timing, queue it up, and exit
		if (post === '')
		{
			this.queue.addPost(post, roomId);
			return;
		}

	// Check for Emote
		if (post.charAt(0) == ':')
		{
try {
			post = post.slice(1);
			post = this.applyData(post, data);
			post = this.applyStandardMacros(post, data);
			post = this.applyGroups(post, data);
			post = this.applyTypo(post, data);
			post = this.applyMTypo(post, data);
			if (canPost) this.queue.addEmote(post, roomId)
} catch(e) {console.log(e.stack)}
		}

	// If not, check for a command
		else if (post.charAt(0) === '/')
		{
			post = this.applyData(post, data);
			this.handleCommand(post, roomId);
		}
	// Otherwise it is a post
		else
		{
		// Do all the post processing on the response
			post = this.applyData(post, data);
			post = this.applyStandardMacros(post, data);
			post = this.applyGroups(post, data);
			post = this.applyTypo(post, data);
			post = this.applyMTypo(post, data);

			if (canPost) this.queue.addPost(post, roomId)
		}
	}

	standardResponseHandler (responseStr, response, start, prepId, data)
	{
		var dst;
		var subIdx;
		var subResponse;
		var canRespond;
		var lastPost = 0;
		var name = data.name;
		var roomId = data.roomId;
		var length = response.length(prepId, start);

		if (lastPost === this.postCount && this.postCount !== 'ALWAYS_RESPOND' && this.singlePost) return;

		lastPost = this.postCount;

	// Apply the randomized defines first, this will add a little uniqueness
	// to the post before checking for duplication
		responseStr = this.applyDefines(responseStr, name);

	// Replace the groups introduced through defines
		responseStr = response.replaceGroups(responseStr, prepId, start);

	// Can we respond
		canRespond = this.queue.canRespond();

	// See if we've done this before, !Pending: is this redundant with the stuff implemented in the queue?
		if (this.queue.botPostExists(responseStr)) return;
		this.queue.trackBotPost(responseStr);

	//	Disambiguate the destination
		if (responseStr.charAt(0) != '|') this.handleOneSubPost(responseStr, data, canRespond);
		else
		{
			responseStr = responseStr.slice(1);
			var subPosts = responseStr.split('|');

		// Break out the subposts if needed
			subPosts.each(function(post)
			{
				this.handleOneSubPost(post, data, canRespond);
			}, this);
		}
	}

	run (types, executeAll, text, data)
	{
		return this.engine.checkResponses(types, executeAll, text, this.standardResponseHandler.bind(this), data);
	}
}

module.exports = Worker;
