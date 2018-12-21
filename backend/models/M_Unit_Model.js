function M_Unit(unit_data) {
  this._id = unit_data._id;
  this.code = unit_data.code;
  this.name = unit_data.name;
  this.description = unit_data.description;
  this.is_delete = unit_data.is_delete;
  this.created_by = unit_data.created_by;
  this.created_date = unit_data.created_date;
  this.updated_by = unit_data.updated_by;
  this.updated_date = unit_data.updated_date;
}

M_Unit.prototype.getData = function() {
  return {
    _id: this._id,
    code: this.code,
    name: this.name,
    description: this.description,
    is_delete: this.is_delete,
    created_by: this.created_by,
    created_date: this.created_date,
    updated_by: this.updated_by,
    updated_date: this.updated_date
  };
};

module.exports = M_Unit;
