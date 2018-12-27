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
        // {
        //   $lookup: {
        //     from: "t_souvenir_item",
        //     localField: "t_souvenir_id",
        //     foreignField: "code",
        //     as: "KEY"
        //   }
        // },
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
        // { $unwind: "$KEY" },
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
        // let t_souvenir = docs.map(row => {
        //   return new T_souvenir(row);
        // });
        callback(docs);
      });
  },

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

  //AUTO INCREMENT
  countCode: (callback, newDate) => {
    //console.log(newDate)
    db.collection("t_souvenir")
      .find({ code: { $regex: new RegExp(newDate) } })
      .count((err, count) => {
        callback(count);
      });
  },

  //POST TRANSACTION SOUVENIR
  createHandler: (callback, data) => {
    //console.log(JSON.stringify(data));
    db.collection("t_souvenir").insert(data, (err, docs) => {
      callback(docs);
    });
  },

  //DELETE TRANSACTION SOUVENIR
  deleteHandler: (callback, id) => {
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: { is_delete: true } },
      (err, docs) => {
        callback(docs);
      }
    );
  },

  //EDIT TRANSACTION SOUVENIR
  updateHandler: (callback, data, id) => {
    //console.log(data);
    db.collection("t_souvenir").updateOne(
      { code: id },
      { $set: data },
      (err, docs) => {
        callback(docs);
      }
    );
  },

  //ini adalah comment
  createItem: (callback, data) => {
    const func = input => {
      return input.map(content => {
        return content;
      });
    };
    db.collection("t_souvenir_item").insertMany(func(data), (err, docs) => {
      callback(docs);
    });
  },

  deleteData: (callback, id) => {
    db.collection("t_souvenir_item").remove(
      { t_souvenir_id: id },
      (err, docs) => {
        callback(docs);
      }
    );
  },

  createData: (callback, formdata) => {
    db.collection("t_souvenir_item").insertMany(formdata, (err, docs) => {
      callback(docs);
    });
  }
};

module.exports = dtl;
