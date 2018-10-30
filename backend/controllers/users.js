'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const usersModel = require('../models/users.model');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const secret = require('../config/token')

const now = new Date();

const UsersController ={ 
    Login : (req, res, next) => {
        var UserName = req.body.UserName;
        var Password = req.body.Password;
        console.log(req.body.UserName);

        if(UserName == null || Password == null){
            Response.send(res, 404, "User Not Found");
        }else{
            global.dbo.collection('Users').findOne({ UserName : UserName}, (err, data) => {
                if(data){
                    console.log(data.UserName);
                    console.log(data.Password);
                
                    if(bcrypt.compareSync(Password, data.Password)){
                        //generae JWT
                        let token = jwt.sign(data, secret.secretkey, {
                            expiresIn : 86400
                    });

                    delete data.Password;
                    let doc = {
                        userdata : data,
                        token : token
                    };

                    Response.send(res, 200, doc);

                }else{
                    Response.send(res, 404, "Password Tidak Sesuai");
                }
                
            }else{
                Response.send(res, 404, "User Tidak Ditemukan");
            }
        });
    }

    },
    Logout : (req, res, next) => {
        let doc = {
            status : "Logout berhasil",
            userdata : null,
            token : null
        };

        Response.send(res, 200, doc);
    },

    CreateUsers : (req, res, next) => {
        let body = req.body;
        var data = {};

        data.UserName = body.UserName;
        data.Password = bcrypt.hashSync(body.Password, 8);
        data.Role = "administrator";
        data.IsDelete = false;
        data.CreateBy = "System";
        data.CreatedDate = now;
        data.UpdateBy = null;
        data.UpdateDate = null;

        var model = new usersModel(data);

        global.dbo.collection('Users').insertOne(model, function(err, data) {
            if(err){
                return next(new Error());
            }

            Response.send(res, 200, data);
        });
    }

}

module.exports = UsersController;