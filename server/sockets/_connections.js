module.exports = {
    userConnect: function() {
        console.log('a user connected', this.id);
    },
    userDisconnect: function() {

        if (this.storage.has(this.id)) {
            const user = this.storage.get(this.id);

            console.log('user disconnected', user.username, this.id);

            this.storage.delete(this.id);
            this.colors.push(user.color);
            this.socket.broadcast.emit('playerDisconnect', this.id);
        }
    }
};