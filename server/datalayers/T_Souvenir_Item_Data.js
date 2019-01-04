const DB = require("../models/Database");
const ObjectID = require("mongodb").ObjectID;
const T_souvenir = require("../models/T_Souvenir_Item_Model");
const T_souvenir_item_view = require("../models/T_Souvenir_Item_File_Model");
const db = DB.getConnection();

const dt = {
  //GET TRANSACTION SOUVENIR ITEM
  readSouvenirAllHandler: callback => {
    db.collection("t_souvenir")
      .aggregate([
        {
          $lookup: {
            from: "m_employee",
            localField: "request_by",
            foreignField: "employee_number",
            as: "employee"
          }
        },
        {
          $lookup: {
            from: "m_employee",
            localField: "created_by",
            foreignField: "employee_number",
            as: "creater"
          }
        },
        { $unwind: "$employee" },
        { $unwind: "$creater" },
        {
          $project: {
            code: "$code",
            type: "$type",
            t_event_id: "$t_event_id",
            request_by: {
              $concat: ["$employee.first_name", " ", "$employee.last_name"]
            },
            request_date: "$request_date",
            request_due_date: "$request_due_date",
            approved_by: "$approved_by",
            approved_date: "$approved_date",
            note: "$note",
            recieved_by: "$recieved_by",
            recieved_date: "$recieved_date",
            settlement_approved_by: "$settlement_approved_by",
            settlement_approved_date: "$settlement_approved_date",
            status: "$status",
            is_delete: "$is_delete",
            created_by: {
              $concat: ["$creater.first_name", " ", "$creater.last_name"]
            },
            created_date: "$created_date",
            updated_by: "$updated_by",
            updated_date: "$updated_date",
            note: "$note",
            _id: 1
          }
        },
        { $match: { is_delete: false } }
      ])
      .toArray((err, docs) => {
        callback(docs);
      });
  },

  readSouvenirItemAllHandler: callback => {
    db.collection("t_souvenir_item")
      .aggregate([
        {
          $lookup: {
            from: "m_souvenir",
            localField: "m_souvenir_id",
            foreignField: "code",
            as: "souv"
          }
        },
        { $unwind: "$souv" },
        {
          $project: {
            m_souvenir_id: "$souv.name",
            m_souvenir_id2: "$m_souvenir_id",
            qty: "$qty",
            qty_actual: { $subtract: ["$qty", "$qty_settlement"] },
            note: "$note",
            created_by: "$created_by",
            created_date: "$created_date",
            is_delete: "$is_delete",
            t_souvenir_id: "$t_souvenir_id",
            updated_by: "$updated_by",
            updated_date: "$updated_date",
            souv_name: "$souv.name",
            _id: 1
          }
        },
        { $match: { is_delete: false } }
      ])
      .toArray((err, docs) => {
        callback(docs);
      });
  },

  readByIdHandler: (callback, id) => {
    db.collection("t_souvenir_item")
      .find({ t_souvenir_id: id })
      //.sort({ t_souvenir_id: 1 })
      .toArray((err, docs) => {
        callback(docs);
      });
  },

  //AUTO INCREMENT
  countCode: (callback, newDate) => {
    console.log(newDate);
    db.collection("t_souvenir")
      .find({ code: { $regex: new RegExp(newDate) } })
      .count((err, count) => {
        callback(count);
      });
  },

  //POST TRANSACTION SOUVENIR
  createHandler: (callback, data) => {
    db.collection("t_souvenir").insert(data, (err, docs) => {
      if (err) {
        callback(err);
      } else {
        callback(data);
      }
    });
  },

  //POST TRANSACTION SOUVENIR ITEM
  createItem: (callback, data) => {
    const func = input => {
      return input.map(content => {
        return content;
      });
    };
    db.collection("t_souvenir_item").insertMany(func(data), (err, docs) => {
      if (err) {
        callback(err);
      } else {
        callback(data);
      }
    });
  },

  deleteData: (callback, id) => {
    db.collection("t_souvenir_item").remove(
      { t_souvenir_id: id },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(id);
        }
      }
    );
  },

  //EDIT TRANSACTION SOUVENIR ITEM
  updateHandler: (callback, data, id) => {
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: data },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(data);
        }
      }
    );
  },

  //APPROVE TRANSACTION SOUVENIR ITEM
  approveHandler: (callback, data, id) => {
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: data },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(data);
        }
      }
    );
  },

  rejectHandler: (callback, data, id) => {
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: data },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(data);
        }
      }
    );
  },

  // RECEIVED SOUVENIR REQUEST
  receivedHandler: (callback, data, id) => {
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: data },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(data);
        }
      }
    );
  },

  // SETTLEMENT SOUVENIR REQUEST
  settlementHandler: (callback, data, id) => {
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: data },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(data);
        }
      }
    );
  },

  settlementItemHandler: (callback, sett, id) => {
    let a = sett.qty_settlement;
    let tampung = [];
    let souv_id = [];
    const func = data => {
      return data.map();
    };
    a.nilai.map((row, index) => {
      let kodeDua = a.kode[index];
      // console.log("ini nilai " + row)
      db.collection("t_souvenir_item").updateOne(
        { t_souvenir_id: id, m_souvenir_id: kodeDua },
        { $set: { qty_settlement: row } },
        (err, docs) => {
          tampung.push(docs);
        }
      );
    });
    callback(tampung);
  },

  // APPROVAL SETTLEMENT SOUVENIR REQUEST
  approveSettlementHandler: (callback, data, id) => {
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: data },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(data);
        }
      }
    );
  },

  // CLOSE ORDER SOUVENIR REQUEST
  closeOrderHandler: (callback, data, id) => {
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: data },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(data);
        }
      }
    );
  }
};

module.exports = dt;
