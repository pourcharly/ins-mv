const SocketServer = require('./lib');
const connections = require('./_connections');
const auth = require('./_auth');
const chat = require('./_chat');
const dice = require('./_dice');

SocketServer
    .addListeners(connections)
    .addListeners(auth)
    .addListeners(chat)
    .addListeners(dice);

module.exports = SocketServer;