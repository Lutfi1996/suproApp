'use strict';

const Response = require('../config/response');

//JSON web token
const jwt = require('jsonwebtoken');
const secret = require('../config/token');

const AuthMiddlewre = {
    checkToken : (req, res, next) => {
        console.log(req.headers);
        var token = req.headers.authorization;

        if(token == null){
            Response.send(res, 403, "You are not authorized");
        }else{
            jwt.verify(token, secret.secretkey, (err, decrypt) => {
                if(decrypt != undefined){
                    req.usedata = decrypt;
                    global.user = decrypt;
                    next();
                }else{
                    Response.send(res, 403, 'You are not authorized')
                }
            });
        }
    }
}

module.exports = AuthMiddlewre;