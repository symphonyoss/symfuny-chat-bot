//var server = 'sym-corp-stage-guse1-aha1.symphony.com';
//var controllerServer = 'corporate.symphony.com';
var server = 'sym-corp-stage-guse1-aha1.symphony.com';
server = 'corporate-api.symphony.com';
server = 'nexus.symphony.com';
server = 'qa6.symphony.com';
server = 'nexus2.symphony.com';

var config = {
	urlConfig : {
		keyUrl: 'https://' + server + ':8444/keyauth',
		sessionUrl: 'https://' + server + ':8444/sessionauth',
		agentUrl: 'https://' + server + ':8444/agent',
		podUrl: 'https://' + server + ':443/pod',
	},

	podServer : server,
}

var env = process.env.node_env;

envConfig = {};
try
{
	if (env) envConfig = require('./config.' + env);
}
catch (e)
{
}

module.exports = Object.merge(config, envConfig);
