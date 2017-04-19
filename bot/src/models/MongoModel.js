"use strict"

var DB = require('./db');
var Q = require('q');

class MongoModel {
	constructor ()
	{
		this.collections = {};
	}

	getCollection (name)
	{
		var deferred = Q.defer();

		if (this.collections[name]) return Q(this.collections[name]);

		DB.isDbReady
			.then(function()
			{
				DB.collection(name, {strict: false}, function(err, data)
				{
					this.collections[name] = data;
					deferred.resolve(data);
				}.bind(this));
			}.bind(this));

		return deferred.promise;
	}

	iterateCursor (cursor, cb)
	{
		function next(err, doc)
		{
			if (err) return cb(null);

			cb(doc);

			if (doc) cursor.nextObject(next);
		}

		cursor.nextObject(next);
	}

	find (search, collection)
	{
		var response = [];
		var cursor = collection.find(search);
		return Q(cursor.toArray());
	}
}

module.exports = MongoModel;
