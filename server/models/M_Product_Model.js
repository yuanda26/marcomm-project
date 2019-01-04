function M_product(mProductData) {
  this._id = mProductData._id;
  this.code = mProductData.code;
  this.name = mProductData.name;
  this.description = mProductData.description;
  this.is_delete = mProductData.is_delete;
  this.created_by = mProductData.created_by;
  this.created_date = mProductData.created_date;
  this.update_by = mProductData.update_by;
  this.update_date = mProductData.update_date;
}

M_product.prototype.getData = function() {
  return {
    _id: this._id,
    code: this.code,
    name: this.name,
    description: this.description,
    is_delete: this.is_delete,
    created_by: this.created_by,
    created_date: this.created_date,
    update_by: this.update_by,
    update_date: this.update_date
  };
};

module.exports = M_product;
