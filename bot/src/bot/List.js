class List {
	constructor ()
	{
		this.keys = [];
		this.values = {};
		this.sorted = true;
		this.dupes = true;
		this.trim = true;
	}

	setSorted (on)
	{
		this.sorted = on;
	}

	setTrim (on)
	{
		this.trim = on;
	}

	setAllowDuplicates (on)
	{
		this.dupes = on;
	}

	add (key, value)
	{
		this.keys.push(key);

		this.values[key] = this.values[key] || [];
		if (!this.dupes) this.values[key] = [value]
		else this.values[key].push(value);

		if (this.sorted) this.keys.sort();
	}

	count ()
	{
		return this.keys.length;
	}

	clear ()
	{
		this.keys = [];
		this.values = {};
	}

	getKeyDataOffset (key, which)
	{
		if (this.sorted) {
			var firstIdx = this.keys.indexOf(key);
			return which - firstIdx;
		}

		var indexes = [];
		var idx = this.keys.indexOf(key);
		while (idx !== -1 && idx < this.keys.length)
		{
			indexes.push(idx);
			idx = this.keys.indexOf(key, idx + 1);
		}

		return indexes.indexOf(which);
	}

	deleteIndex (idx)
	{
		if (idx >= this.keys.length);

		var key = this.keys[idx];
		var which = this.getKeyDataOffset(key, idx);
		var data = this.values[key];

		data.splice(which, 1);
		this.keys.splice(idx, 1);
	}

	data (idx)
	{
		if (idx >= this.keys.length);

		var key = this.keys[idx];
		var which = this.getKeyDataOffset(key, idx);
		var data = this.values[key][which];

		return data;
	}

	exist (key)
	{
		return this.keys.indexOf(key) !== -1;
	}

	find (key)
	{
		var data = this.values[key];
		return data && data.length && data[0] || false;
	}
}

module.exports = List;
