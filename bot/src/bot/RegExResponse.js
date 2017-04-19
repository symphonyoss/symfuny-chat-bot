module.exports = new Class({
	initialize : function(search, replace, caseSensitive, convert)
	{
		this.search = search;
		this.replace = replace || '';
		this.caseSensitive = caseSensitive;
		this.prepId = 0;
		this.preps = {};

		var flags = (!caseSensitive?'i':'') + 'g';

		if (convert)
		{
			this.search = this.replaceAll(this.search, '<', '\\b');
			this.search = this.replaceAll(this.search, '>', '\\b');
			this.search = this.replaceAll(this.search, '*', '.*?');
			this.search = this.replaceAll(this.search, '[~\]?', '.?');
			this.search = this.replaceAll(this.search, '^?', '.?');
			this.search = this.replaceAll(this.search, '[~', '[^');
			this.search = this.replaceAll(this.search, '{', '(');
			this.search = this.replaceAll(this.search, '}', ')');

			this.replace = this.replaceAll(this.replace, '\\0', '$1');
			this.replace = this.replaceAll(this.replace, '\\1', '$2');
			this.replace = this.replaceAll(this.replace, '\\2', '$3');
			this.replace = this.replaceAll(this.replace, '\\3', '$4');
			this.replace = this.replaceAll(this.replace, '\\4', '$5');
			this.replace = this.replaceAll(this.replace, '\\5', '$6');
			this.replace = this.replaceAll(this.replace, '\\6', '$7');
			this.replace = this.replaceAll(this.replace, '\\7', '$8');
			this.replace = this.replaceAll(this.replace, '\\8', '$9');
		}

		this.regEx = new RegExp(this.search, flags);
	},

	replaceAll : function(string, search, replace)
	{
		search = search.escapeRegExp();
		var regex = new RegExp(search, 'g');
		return string.replace(regex, replace);

		return string;
	},

	prep : function(str) {
		this.prepId++;
		this.preps[this.prepId] = {};
		var match = this.regEx.exec(str);

		while(match && match[0] != '')
		{
			var idx = this.regEx.lastIndex - match[0].length;
			this.preps[this.prepId][idx] = match;
			match = this.regEx.exec(str);
		}


		return this.prepId;
	},

	freePrep : function(id)
	{
		delete this.preps[id];
	},

	match : function(id, index)
	{
		if (!this.preps[id][index]) return 0;
		return this.length(id, index);
	},

	length : function(id, index)
	{
		if (!this.preps[id][index]) return 0;
		return this.preps[id][index][0].length;
	},

	expand : function(response, id, index)
	{
		if (!this.preps[id][index]) return response;

		var replace = response;
		match = this.preps[id][index];

		replace = this.replaceAll(replace, '\\0', '$1');
		replace = this.replaceAll(replace, '\\1', '$2');
		replace = this.replaceAll(replace, '\\2', '$3');
		replace = this.replaceAll(replace, '\\3', '$4');
		replace = this.replaceAll(replace, '\\4', '$5');
		replace = this.replaceAll(replace, '\\5', '$6');
		replace = this.replaceAll(replace, '\\6', '$7');
		replace = this.replaceAll(replace, '\\7', '$8');
		replace = this.replaceAll(replace, '\\8', '$9');

		for (var idx = 1; idx < match.length; idx++)
		{
			var group = new RegExp('\\$' + idx, 'g');
			replace = replace.replace(group, match[idx]);
		}

		return replace;
	}
});
