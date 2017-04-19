var Q = require('q');
var RpcHandler =  require('sapphire-rpc').RpcHandler;
var ScriptModel = require('../models/ScriptModel');
var uuid = require('node-uuid');

class RpcScript extends RpcHandler {
	constructor ()
	{
		super('script', SERVER);
		this.scriptModel = new ScriptModel();
		this.scripts = {};
	}

	getBotScripts (channel, data)
	{
		var id = data.botId;
		var scriptsModel = new ScriptModel();

		return scriptsModel.getByBotId(id);
	}

	getOwnerScripts (channel, data)
	{
		var session = req.session.get();
		var id = data.botId;
		var scriptsModel = new ScriptModel();

		return scriptsModel.getByOwner(id);
	}

	getPublicScripts (channel, data)
	{
		var scriptsModel = new ScriptModel();

		return scriptsModel.getPublic()
	}

	createScript (channel, data)
	{
		var script = data;

		var scriptsModel = new ScriptModel();
		var id = uuid.v4();

		script.id = id;

		return scriptsModel.upsert(script)
	}

	saveScript (channel, data)
	{
		var script = data
		var scriptsModel = new ScriptModel();

		return scriptsModel.upsert(script)
	}
}

var script = new RpcScript();
