function M_User(mUserData) {
  this._id = mUserData._id;
  this.username = mUserData.username;
  this.password = mUserData.password;
  this.m_role_id = mUserData.m_role_id;
  this.m_employee_id = mUserData.m_employee_id;
  this.role_name = mUserData.role_name;
  this.name = mUserData.name;
  this.is_delete = mUserData.is_delete;
  this.created_by = mUserData.created_by;
  this.created_date = mUserData.created_date;
  this.updated_by = mUserData.updated_by;
  this.updated_date = mUserData.updated_date;
}

M_User.prototype.getData = function() {
  return {
    _id: this._id,
    username: this.username,
    password: this.password,
    m_role_id: this.m_role_id,
    m_employee_id: this.m_employee_id,
    role_name: this.role_name,
    name: this.name,
    is_delete: this.is_delete,
    created_by: this.created_by,
    created_date: this.created_date,
    updated_by: this.updated_by,
    updated_date: this.updated_date
  };
};

module.exports = M_User;
