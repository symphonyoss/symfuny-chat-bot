var fs = require('fs');
module.exports = {
	port: 8080,
	baseUrl : 'https://localhost:8080/',
	useCompression: false,
	builderCache: false,
	minify : false,
	https: {
		key : fs.readFileSync(__dirname + '/certs/localhost.key', {encoding: 'utf-8'}),
		cert : fs.readFileSync(__dirname + '/certs/localhost.cert', {encoding: 'utf-8'}),
	},
};
