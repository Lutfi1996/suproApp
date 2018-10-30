'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const suppliersModel = require('../models/suppliers.model')

const now = new Date();

const SuppliersController = {
    getAllSuppliers : (req, res, next) => {
        global.dbo.collection('Suppliers').aggregate([
            {
              $match : { IsDelete : false }
            },
            {
              $project:
              {
                CompanyName : "$CompanyName",
                ContactName : "$ContactName",
                Address : { $concat: [ "$Address", " ", "$City", " ", "$PostalCode", " " , "$Country" ] },
                IsDelete : "$IsDelete",
                CreateBy : "$CreateBy", 
                CreatedDate : "$CreatedDate", 
                UpdateBy : "$UpdateBy", 
                UpdateDate : "$UpdateDate",
                _id : 1
              }
            }
            ]).toArray((err, data) => {
            if(err){
                return next(new Error());
            }

            Response.send(res, 200, data);
        })
    },

    getAllById : (req, res, next) => {
        let id =  req.params.id;
        global.dbo.collection('Suppliers').aggregate([
            {
              $match : { IsDelete : false ,
                        '_id' : ObjectID(id) }
            },
            {
              $project:
              {
                CompanyName : "$CompanyName",
                ContactName : "$ContactName",
                Address : { $concat: [ "$Address", " ", "$City", " ", "$PostalCode", " " , "$Country" ] },
                IsDelete : "$IsDelete",
                CreateBy : "$CreateBy", 
                CreatedDate : "$CreatedDate", 
                UpdateBy : "$UpdateBy", 
                UpdateDate : "$UpdateDate",
                _id : 1
              }
            }
            ]).toArray((err, data) => {
            if(err){
                return next(new Error());
            }
            let model = data.map((entity) => {
                return new suppliersModel(entity);
            });
            Response.send(res, 200, model);
        });
    },

    CreatedSuppliers : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.CompanyName = reqdata.CompanyName;
        data.ContactName = reqdata.ContactName;
        data.ContactEmail = reqdata.ContactEmail;
        data.ContactTitle = reqdata.ContactTitle;
        data.Address = reqdata.Address;
        data.City = reqdata.City;
        data.PostalCode = reqdata.PostalCode;
        data.Country = reqdata.Country;
        data.Phone = reqdata.Phone;
        data.Fax = reqdata.Fax;
        data.IsDelete = false;
        data.CreateBy = global.user.UserName;
        data.CreatedDate = now;
        data.UpdateBy = null;
        data.UpdateDate = null;

        var model = new suppliersModel(data);

        global.dbo.collection('Suppliers').insertOne(model, function(err, data){
            if(err){
                return next(new Error());
            }
            Response.send(res, 200, data)
        });
    },

    UpdateSupplier : (req, res, next) => {
        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('Suppliers').find({ IsDelete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new suppliersModel(entity);
            });

            updatemodel._id = ObjectID(id);

            console.log("Masuk");
            console.log(oldmodel)
            

            if(reqdata.CompanyName == null || reqdata.CompanyName == undefined || reqdata.CompanyName == "") 
            {
                updatemodel.CompanyName = oldmodel[0].CompanyName;
            } else {
                updatemodel.CompanyName    = reqdata.CompanyName;
            }
            
            if(reqdata.ContactName == null || reqdata.ContactName == undefined || reqdata.ContactName == "") {
                updatemodel.ContactName = oldmodel[0].ContactName;
            } else {
                updatemodel.ContactName    = reqdata.ContactName;
            }
            
            if(reqdata.ContactEmail == null || reqdata.ContactEmail == undefined || reqdata.ContactEmail == "") {
                updatemodel.ContactEmail = oldmodel[0].ContactEmail;
            } else {
                updatemodel.ContactEmail    = reqdata.ContactEmail;
            }

            if(reqdata.ContactTitle == null || reqdata.ContactTitle == undefined || reqdata.ContactTitle == "") {
                updatemodel.ContactTitle = oldmodel[0].ContactTitle;
            } else {
                updatemodel.ContactTitle    = reqdata.ContactTitle;
            }

            if(reqdata.Address == null || reqdata.Address == undefined || reqdata.Address == "") {
                updatemodel.Address = oldmodel[0].Address;
            } else {
                updatemodel.Address    = reqdata.Address;
            }

            if(reqdata.City == null || reqdata.City == undefined || reqdata.City == "") {
                updatemodel.City = oldmodel[0].City;
            } else {
                updatemodel.City    = reqdata.City;
            }

            if(reqdata.PostalCode == null || reqdata.PostalCode == undefined || reqdata.PostalCode == "") {
                updatemodel.PostalCode = oldmodel[0].PostalCode;
            } else {
                updatemodel.PostalCode    = reqdata.PostalCode;
            }

            if(reqdata.Country == null || reqdata.Country == undefined || reqdata.Country == "") {
                updatemodel.Country = oldmodel[0].Country;
            } else {
                updatemodel.Country    = reqdata.Country;
            }

            if(reqdata.Phone == null || reqdata.Phone == undefined || reqdata.Phone == "") {
                updatemodel.Phone = oldmodel[0].Phone;
            } else {
                updatemodel.Phone    = reqdata.Phone;
            }

            if(reqdata.Fax == null || reqdata.Fax == undefined || reqdata.Fax == "") {
                updatemodel.Fax = oldmodel[0].Fax;
            } else {
                updatemodel.Fax    = reqdata.Fax;
            }

            updatemodel.IsDelete = oldmodel[0].IsDelete;
            updatemodel.CreateBy = oldmodel[0].CreateBy;
            updatemodel.CreatedDate = oldmodel[0].CreatedDate;
            updatemodel.UpdateBy = global.user.UserName;
            updatemodel.UpdateDate = now;

            var model = new suppliersModel(updatemodel);

            global.dbo.collection('Suppliers').findOneAndUpdate
            (
                { '_id' : ObjectID(id)},
                { $set : model },
                function(err,data){
                    if(err)
                    {
                        return next (new Error());
                    }

                    Response.send(res, 200, data);
                }
            );
        });
    },

    DeleteSupplier : (req, res, next) => {
        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('Suppliers').find({ IsDelete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new suppliersModel(entity);
            });

            deletemodel._id = ObjectID(id);
            deletemodel.CompanyName = oldmodel[0].CompanyName;
            deletemodel.ContactName = oldmodel[0].ContactName;
            deletemodel.ContactEmail = oldmodel[0].ContactEmail;
            deletemodel.ContactTitle = oldmodel[0].ContactTitle;
            deletemodel.Address = oldmodel[0].Address;
            deletemodel.City = oldmodel[0].City;
            deletemodel.PostalCode = oldmodel[0].PostalCode;
            deletemodel.Country = oldmodel[0].Country;
            deletemodel.Phone = oldmodel[0].Phone;
            deletemodel.Fax = oldmodel[0].Fax;
            deletemodel.IsDelete = true;
            deletemodel.CreateBy = oldmodel[0].CreateBy;
            deletemodel.CreatedDate = oldmodel[0].CreatedDate;
            deletemodel.UpdateBy = global.user.UserName;
            deletemodel.UpdateDate = now;

            var model = new suppliersModel(deletemodel);

            global.dbo.collection('Suppliers').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        return next(new Error());
                    }

                    Response.send(res, 200, data);
                }
            );
        });
    }

};

module.exports = SuppliersController;