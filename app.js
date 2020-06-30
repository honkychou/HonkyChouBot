const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const { TGRouter } = require('./TGBot/honky_chou');

const app = express();

app.use(bodyParser.json());

const privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/honkychou.xyz/privkey.pem',
    'utf8'
);
const certificate = fs.readFileSync(
    '/etc/letsencrypt/live/honkychou.xyz/cert.pem',
    'utf8'
);
const ca = fs.readFileSync(
    '/etc/letsencrypt/live/honkychou.xyz/chain.pem',
    'utf8'
);

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
};

app.post('/webhook', (req, res, next) => {
    console.log(req.body);
    TGRouter(req);
    res.send('Request Received.');
});

app.get('/', (req, res, next) => {
    // remain for portfolio
    res.send('Request Received.');
});
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});
