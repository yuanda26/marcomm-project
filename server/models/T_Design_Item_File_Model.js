function T_Design_File(designFileData) {
  this._id = designFileData._id;
  this.t_design_item_id = designFileData.t_design_item_id;
  this.filename = designFileData.filename;
  this.size = designFileData.size;
  this.extention = designFileData.extention;
  this.is_delete = designFileData.is_delete;
  this.created_by = designFileData.created_by;
  this.created_date = designFileData.created_date;
  this.updated_by = designFileData.updated_by;
  this.updated_date = designFileData.updated_date;
}

T_Design_File.prototype.getData = function() {
  return {
    _id: this._id,
    t_design_item_id: this.t_design_item_id,
    filename: this.filename,
    size: this.size,
    extention: this.extention,
    is_delete: this.is_delete,
    created_by: this.created_by,
    created_date: this.created_date,
    updated_by: this.updated_by,
    updated_date: this.updated_date
  };
};

module.exports = T_Design_File;
