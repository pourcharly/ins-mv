const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketServer = require('./sockets/server').start(http);

const port = process.env.PORT || 8080;
const path = require("path")
const root = path.join(__dirname, "../");

const apiRouter = require('./api')


app
    .use(express.static(root + "dist/insmv"))
    .use('/data', express.static(root + "data"))
    
    .use(express.json())
    .use('/api', apiRouter)
    .get('*', (req, res) => {
        const options = { root };

        res.sendFile("dist/insmv/index.html", options);
    });

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${ port }`);
});