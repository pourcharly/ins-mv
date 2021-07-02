const db = require('./abstract-db');

module.exports = db.get('config').value();