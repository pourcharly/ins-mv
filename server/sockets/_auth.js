const { authenticateUser } = require('../helpers');

module.exports = {
    authenticate: function(token) {
        const user = authenticateUser(token)?.value();

        if (!!user) {
            const list = [];
            user.color = this.colors.shift();
            console.log('authenticate', user.username, user.color);

            this.storage.set(this.id, user);
            this.socket.broadcast.emit('playerConnect', {
                socketId: this.id,
                user
            });

            this.storage.forEach((value, socketId) => {
                const data = {
                    socketId,
                    user: this.storage.get(socketId)
                };
                if (user.isMJ) {
                    list.unshift(data);
                } else {
                    list.push(data);
                }
            });
            console.log('emit PlayerList to', user.username);
            this.socket.emit('playerList', list);
        }
    }
};