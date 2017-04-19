class Response {
	constructor (type, regEx, numerator, denominator)
	{
		this.type = type;
		this.regExp = regEx;
		this.numerator = numerator;
		this.denominator = denominator;
	}

	prep (string)
	{
		return this.regExp.prep(string);
	}

	freePrep (id)
	{
		this.regExp.freePrep(id);
	}

	getReplacement ()
	{
		return this.regExp.replace;
	}

	typeMatch (types)
	{
		return types.indexOf(this.type) !== -1;
	}

	matchAt (id, startIndex)
	{
		return this.regExp.match(id, startIndex);
	}

	length (id, startIndex)
	{
		return this.regExp.length(id, startIndex);
	}

	checkProbability ()
	{
		var random = Math.random();
		var result = random * this.denominator < this.numerator;

		return result;
	}

	replaceGroups (response, id, start)
	{
		return this.regExp.expand(response, id, start);
	}
}

module.exports = Response;
