const DB = require("../models/Database");
const ObjectID = require("mongodb").ObjectID;
const T_souvenir = require("../models/T_Souvenir_Model");
const db = DB.getConnection();
const souvModel = require("../models/T_Souvenir_Item_Model");
const dtl = {
  //GET TRANSACTION SOUVENIR
  readSouvenirAllHandler: callback => {
    db.collection("t_souvenir")
      .aggregate([
        {
          $lookup: {
            from: "m_employee",
            localField: "received_by",
            foreignField: "employee_number",
            as: "receiver"
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
        { $unwind: "$receiver" },
        { $unwind: "$creater" },
        {
          $project: {
            code: "$code",
            received_by_id: "$received_by",
            received_by: {
              $concat: ["$receiver.first_name", " ", "$receiver.last_name"]
            },
            received_date: "$received_date",
            created_by: {
              $concat: ["$creater.first_name", " ", "$creater.last_name"]
            },
            created_date: "$created_date",
            note: "$note"
          }
        }
      ])
      .toArray((err, docs) => {
        callback(docs);
      });
  },

  //GET TRANSACTION SOUVENIR BY ID
  readByIdHandler: (callback, id) => {
    db.collection("t_souvenir")
      .find({ code: id })
      .sort({ code: 1 })
      .toArray((err, docs) => {
        let t_souvenir = docs.map(row => {
          return new T_souvenir(row);
        });
        callback(t_souvenir);
      });
  },

  //AUTO INCREMENT CODE
  countCode: (callback, newDate) => {
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

  //DELETE TRANSACTION SOUVENIR
  deleteHandler: (callback, id) => {
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: { is_delete: true } },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(id);
        }
      }
    );
  },

  //EDIT TRANSACTION SOUVENIR
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

  createData: (callback, formdata) => {
    db.collection("t_souvenir_item").insertMany(formdata, (err, docs) => {
      if (err) {
        callback(err);
      } else {
        callback(formdata);
      }
    });
  }
};

module.exports = dtl;
