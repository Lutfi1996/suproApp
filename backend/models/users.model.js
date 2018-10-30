'use strict'

function model (entity){
    this._id            = entity._id;
    this.UserName       = entity.UserName;
    this.Password       = entity.Password;
    this.Role           = entity.Role;
    this.IsDelete       = entity.IsDelete;
    this.CreateBy       = entity.CreateBy;
    this.CreatedDate    = entity.CreatedDate;
    this.UpdateBy       = entity.UpdateBy;
    this.UpdateDate     = entity.UpdateDate
}

model.prototype.getData = function(){
    return {
        _id            : this._id,
        UserName        : this.UserName,
        Password        : this.Password,
        Role            : this.Role,
        IsDelete       : this.IsDelete,
        CreateBy       : this.CreateBy,
        CreatedDate    : this.CreatedDate,
        UpdateBy       : this.UpdateBy,
        UpdateDate     : this.UpdateDate
    };
};

module.exports = model;