const jwt = require('jsonwebtoken');
const db = require('./abstract-db');
const jwtSecret = require('./config').jwt.secret;

module.exports = {
    authenticateUser: (token) => {
        try {
            const payload = jwt.verify(token, jwtSecret);
            const user = db.get('users').find({ email: payload.sub });

            //console.log(payload);

            return user || null;
        } catch (e) {
            return null;
        }
    }
};