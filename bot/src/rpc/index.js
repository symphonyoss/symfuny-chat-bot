var Rpc = require('sapphire-rpc').Rpc;
global.SERVER =  new Rpc();
SERVER.start('scb');
require('./bot');
require('./script');
