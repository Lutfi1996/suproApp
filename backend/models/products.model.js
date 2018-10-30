'use strict'

function model (entity){
    this._id                = entity._id;
    this.ProductName        = entity.ProductName;
    this.SuplierName        = entity.SuplierName;
    this.CategoryName       = entity.CategoryName;
    this.QuantityPerUnit    = entity.QuantityPerUnit;
    this.UnitPrice          = entity.UnitPrice;
    this.UnitsInStock       = entity.UnitsInStock;
    this.IsDelete           = entity.IsDelete;
    this.CreateBy           = entity.CreateBy;
    this.CreatedDate        = entity.CreatedDate;
    this.UpdateBy           = entity.UpdateBy;
    this.UpdateDate         = entity.UpdateDate
}

model.prototype.getData = function(){
    return {
        _id                 : this._id,
        ProductName         : this.ProductName,
        SuplierName         : this.SuplierName,
        CategoryName        : this.CategoryName,
        QuantityPerUnit     : this.QuantityPerUnit,
        UnitPrice           : this.UnitPrice,
        UnitsInStock        : this.UnitsInStock,
        IsDelete            : this.IsDelete,
        CreateBy            : this.CreateBy,
        CreatedDate         : this.CreatedDate,
        UpdateBy            : this.UpdateBy,
        UpdateDate          : this.UpdateDate
    };
};

module.exports = model;