const refresh_secret = require('../env.config.js').refresh_secret;
const jwt = require('jsonwebtoken');
const validityTime = require('../env.config.js').jwtValidityTimeInSeconds;
const crypto = require('crypto');
const fs = require('fs');

const cert = fs.readFileSync('./security/tls/private.key');


exports.login = (req, res) => {
    try {
        let refreshId = req.body.userId + refresh_secret + req.body.jti;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        let token = jwt.sign(req.body, cert, { algorithm: 'RS512'});
        let refresh_token = salt+'$'+hash;
        res.status(201).send({accessToken: token, refreshToken: refresh_token});
    } catch (err) {
        console.error(err);
        res.status(500).send({errors: err});
    }
};

exports.refresh_token = (req, res) => {
    try {
        const now = Math.floor(Date.now() / 1000);
        req.body.iat = now;
        req.body.exp = now + validityTime;
        let token = jwt.sign(req.body,cert, { algorithm: 'RS512'});
        res.status(201).send({accessToken: token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.resetRefreshSecret = (_req, res) => {
    try {
        config.initRefreshSecret();
        res.status(204).send({});
    }catch (err) {
        res.status(500).send({errors: err});
    }
};