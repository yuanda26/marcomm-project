function T_souvenir_item_view(t_souvenir_item_view_data) {
    this._id = t_souvenir_item_view_data._id;
    this.m_souvenir_id = t_souvenir_item_view_data.m_souvenir_id;
    this.qty = t_souvenir_item_view_data.qty;
    this.note = t_souvenir_item_view_data.note;
    this.t_souvenir_id = t_souvenir_item_view_data.t_souvenir_id;
  }
  
  T_souvenir_item_view.prototype.getData = function() {
    return {
      _id: this._id,
      m_souvenir_id: this.m_souvenir_id,
      qty: this.qty,
      note: this.note,
      t_souvenir_id: this.t_souvenir_id,
    };
  };
  
  module.exports = T_souvenir_item_view;