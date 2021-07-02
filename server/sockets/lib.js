const socketIo = require('socket.io');
const listeners = { };
const storage = new Map();
const colors = [
    'aqua',
    'fushia',
    'olive',
    'orange',
    'lime',
    'yellow'
];

const aliases = {
    userConnect: 'connection',
    userDisconnect: 'disconnect'
};

const dispatcher = function (socket, listener, args) {
    if (typeof listener === 'function') {
        let callback = () => {};

        if (!!args?.length && typeof args[args.length -1] === 'function') {
            callback = args.pop();
        }

        callback(listener.apply(socket, args));
    }
};

const SocketUser = function (socket) {
    this.socket = socket;
    this.id = socket.id;
    this.storage = storage;
    this.colors = colors;

    const connectListener = listeners['connection'];
    dispatcher(socket, connectListener);

    Object.keys(listeners).forEach((eventName) => {
        const listener = listeners[eventName];

        socket.on(eventName, (...args) => dispatcher(this, listener, args));
    });
};

const SocketServer = {
    on: function(eventName, listener) {
        if (eventName in aliases) {
            eventName = aliases[ eventName ]
        }
    
        listeners[eventName] = listener;
    
        return SocketServer;
    },
    addListeners(listenersParamObj) {
        Object.keys(listenersParamObj).forEach(eventName => {
            const listener = listenersParamObj[eventName];
            this.on(eventName, listener);
        });

        return SocketServer;
    },
    start: function(http) {
        const io = socketIo(http);
    
        io.on('connection', socket => new SocketUser(socket));

        return SocketServer;
    } 
}

module.exports = SocketServer;