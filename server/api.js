const fs = require('fs');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authGuard = require('./auth.guard.js');
const db = require('./abstract-db');
const jwtSecret = require('./config').jwt.secret;

module.exports = router
    .post('/auth', (req, res) => {
        const { email } = req.body;

        const user = db.get('users').find({ email });

        if (user) {
            const token = jwt.sign({ sub: email }, jwtSecret);

            res.json({ user: user.value(), token });
        } else {
            res.status(401).send('Bad credentials error')
        }

    })
    .use(authGuard)
    .get('/user', (req, res) => {
        res.json(req?.user);
    })
    .get('/sheet', (req, res) => {
        const sheetName = req.user.sheet;

        if (sheetName) {
            fs.readFile('./data/' + sheetName + '.json', 'utf8', function (err, data) {
                if (err) throw err;
                
                res.json(JSON.parse(data));
            });
        } else {
            res.json(null);
        }
    });