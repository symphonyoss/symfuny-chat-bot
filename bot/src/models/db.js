var mongodb = require('mongodb');
var Q = require('q');

var server = new mongodb.Server('127.0.0.1', 27017, {});
var db = new mongodb.Db('bot', server, {});
var deferred = Q.defer();
db.isDbReady = deferred.promise;
db.open(function() {deferred.resolve(true);});

module.exports = db;

