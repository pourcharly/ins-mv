module.exports = {
    rollDice: function(nbDice, diceValue) {
        const result = Array.from(new Array(nbDice)).map(() => Math.round(Math.random() * diceValue + .5));

        if (this.storage.has(this.id)) {
            console.log('result', result);
            this.socket.broadcast.emit('playerRollDice', this.id, result);
        }

        return result;
    }
};