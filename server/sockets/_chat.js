module.exports = {
    sendMessageTo: function(playerId, msgContent) {
        if (this.storage.has(this.id) && typeof msgContent === 'string') {
            if (playerId === '*') {
                this.socket.broadcast.emit('chatMessage', msgContent, this.id, '*');
            } else {
                this.socket.to(playerId).emit('chatMessage', msgContent, this.id, playerId)
            }
        }
    }
};