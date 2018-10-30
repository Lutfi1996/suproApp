'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const productsModel = require('../models/products.model')

const now = new Date();

const ProductsController = {
    getAllProducts : (req, res, next) => {
        global.dbo.collection('Products').aggregate([
            {
              $lookup:
              {
                from : "Suppliers",
                localField : "SuplierName",
                foreignField : "_id",
                as : "Supp_Lookup"
              }
            },
            {
              $unwind : "$Supp_Lookup"
            },
            {
              $match : { IsDelete : false }
            },
            {
              $project:
              {
                ProductName : "$ProductName",
                SuplierName : "$Supp_Lookup.CompanyName",
                CategoryName : "$CategoryName",
                QuantityPerUnit : "$QuantityPerUnit",
                UnitPrice : "$UnitPrice",
                UnitsInStock : "$UnitsInStock",
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
    getAllProductsById : (req, res, next) => {
        let id =  req.params.id;
        global.dbo.collection('Products').aggregate([
            {
              $lookup:
              {
                from : "Suppliers",
                localField : "SuplierName",
                foreignField : "_id",
                as : "Supp_Lookup"
              }
            },
            {
              $unwind : "$Supp_Lookup"
            },
            {
              $match : { IsDelete : false ,
                        '_id' : ObjectID(id)}
            },
            {
              $project:
              {
                ProductName : "$ProductName",
                SuplierName : "$Supp_Lookup.CompanyName",
                CategoryName : "$CategoryName",
                QuantityPerUnit : "$QuantityPerUnit",
                UnitPrice : "$UnitPrice",
                UnitsInStock : "$UnitsInStock",
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
        });
    },

    CreatedProducts : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.ProductName = reqdata.ProductName;
        data.SuplierName = ObjectID(reqdata.SuplierName);
        data.CategoryName = reqdata.CategoryName;
        data.QuantityPerUnit = reqdata.QuantityPerUnit;
        data.UnitPrice = reqdata.UnitPrice;
        data.UnitsInStock = reqdata.UnitsInStock;
        data.IsDelete = false;
        data.CreateBy = global.user.UserName;
        data.CreatedDate = now;
        data.UpdateBy = null;
        data.UpdateDate = null;

        var model = new productsModel(data);

        global.dbo.collection('Products').insertOne(model, function(err, data){
            if(err){
                return next(new Error());
            }
            Response.send(res, 200, data)
        });
    },

    UpdateProducts : (req, res, next) => {
        let id = req.params.id;
        let reqdata = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('Products').find({ IsDelete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err){
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new productsModel(entity);
            });

            updatemodel._id = ObjectID(id);

            if(reqdata.ProductName == null || reqdata.ProductName == undefined || reqdata.ProductName == "") 
            {
                updatemodel.ProductName = oldmodel[0].ProductName;
            } else {
                updatemodel.ProductName    = reqdata.ProductName;
            }
            
            if(reqdata.SuplierName == null || reqdata.SuplierName == undefined || reqdata.SuplierName == "") {
                updatemodel.SuplierName = ObjectID(oldmodel[0].SuplierName);
            } else {
                updatemodel.SuplierName = ObjectID(reqdata.SuplierName);
            }
            
            if(reqdata.CategoryName == null || reqdata.CategoryName == undefined || reqdata.CategoryName == "") {
                updatemodel.CategoryName = oldmodel[0].CategoryName;
            } else {
                updatemodel.CategoryName    = reqdata.CategoryName;
            }

            if(reqdata.QuantityPerUnit == null || reqdata.QuantityPerUnit == undefined || reqdata.QuantityPerUnit == "") {
                updatemodel.QuantityPerUnit = oldmodel[0].QuantityPerUnit;
            } else {
                updatemodel.QuantityPerUnit    = reqdata.QuantityPerUnit;
            }

            if(reqdata.UnitPrice == null || reqdata.UnitPrice == undefined || reqdata.UnitPrice == "") {
                updatemodel.UnitPrice = oldmodel[0].UnitPrice;
            } else {
                updatemodel.UnitPrice    = reqdata.UnitPrice;
            }

            if(reqdata.UnitsInStock == null || reqdata.UnitsInStock == undefined || reqdata.UnitsInStock == "") {
                updatemodel.UnitsInStock = oldmodel[0].UnitsInStock;
            } else {
                updatemodel.UnitsInStock    = reqdata.UnitsInStock;
            }

            updatemodel.IsDelete = oldmodel[0].IsDelete;
            updatemodel.CreateBy = oldmodel[0].CreateBy;
            updatemodel.CreatedDate = oldmodel[0].CreatedDate;
            updatemodel.UpdateBy = global.user.UserName;
            updatemodel.UpdateDate = now;

            var model = new productsModel(updatemodel);

            global.dbo.collection('Products').findOneAndUpdate
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

    DeleteProducts : (req, res, next) => {
        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('Products').find({ IsDelete : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new productsModel(entity);
            });


            deletemodel._id = ObjectID(id);
            deletemodel.ProductName = oldmodel[0].ProductName;
            deletemodel.SuplierName = oldmodel[0].SuplierName;
            deletemodel.CategoryName = oldmodel[0].CategoryName;
            deletemodel.QuantityPerUnit = oldmodel[0].QuantityPerUnit;
            deletemodel.UnitPrice = oldmodel[0].UnitPrice;
            deletemodel.UnitsInStock = oldmodel[0].UnitsInStock;
            deletemodel.IsDelete = true;
            deletemodel.CreateBy = oldmodel[0].CreateBy;
            deletemodel.CreatedDate = oldmodel[0].CreatedDate;
            deletemodel.UpdateBy = global.user.UserName;
            deletemodel.UpdateDate = now;

            var model = new productsModel(deletemodel);

            global.dbo.collection('Products').findOneAndUpdate
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


}
module.exports = ProductsController;