const { authenticateUser } = require('./helpers');

module.exports = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = authorization ? authorization.replace(/^.*bearer\s*(.*).*$/i, '$1') : null;
    const user = authenticateUser(token);

    if (user) {
        req.user = user.value();
        next();
    } else {
        res.status(401).send({ error: 'You must login to access to the ressource' });
    }
}