function tEvent(eventData) {
  this._id = eventData._id;
  this.code = eventData.code;
  this.event_name = eventData.event_name;
  this.start_date = eventData.start_date;
  this.end_date = eventData.end_date;
  this.place = eventData.place;
  this.budget = eventData.budget;
  this.request_by = eventData.request_by;
  this.request_by_first_name = eventData.request_by_first_name;
  this.request_by_last_name = eventData.request_by_last_name;
  this.request_date = eventData.request_date;
  this.approved_by = eventData.approved_by;
  this.approved_date = eventData.approved_date;
  this.assign_to = eventData.assign_to;
  this.closed_date = eventData.closed_date;
  this.note = eventData.note;
  this.status = eventData.status;
  this.reject_reason = eventData.reject_reason;
  this.is_delete = eventData.false;
  this.created_by = eventData.created_by;
  this.created_by_employee = eventData.created_by_employee;
  this.created_date = eventData.created_date;
  this.updated_by = eventData.updated_by;
  this.updated_date = eventData.updated_date;
}

tEvent.prototype.getData = function() {
  return {
    _id: this._id,
    code: this.code,
    event_name: this.event_name,
    start_date: this.start_date,
    end_date: this.end_date,
    place: this.place,
    budget: this.budget,
    request_by: this.request_by,
    request_by_first_name: this.request_by_first_name,
    request_by_last_name: this.request_by_last_name,
    request_date: this.request_date,
    approved_by: this.approved_by,
    approved_date: this.approved_date,
    assign_to: this.assign_to,
    closed_date: this.closed_date,
    note: this.note,
    status: this.status,
    reject_reason: this.reject_reason,
    is_delete: this.false,
    created_by: this.created_by,
    created_by_employee: this.created_by_employee,
    created_date: this.created_date,
    updated_by: this.updated_by,
    updated_date: this.updated_date
  };
};

module.exports = tEvent;
