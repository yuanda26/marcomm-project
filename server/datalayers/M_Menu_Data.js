const Database = require("../models/Database");
const ObjectID = require("mongodb").ObjectID;
const M_Menu = require("../models/M_Menu_Model");

const db = Database.getConnection();
const menuData = {
  readMenuAlHandlerData: callback => {
    db.collection("m_menu")
      .aggregate([
        {
          $lookup: {
            from: "m_employee",
            localField: "created_by",
            foreignField: "employee_number",
            as: "creater"
          }
        },
        { $unwind: "$creater" },
        {
          $project: {
            code: "$code",
            name: "$name",
            controller: "$controller",
            parent_id: "$parent_id",
            is_delete: "$is_delete",
            created_by: {
              $concat: ["$creater.first_name", " ", "$creater.last_name"]
            },
            created_date: "$created_date",
            _id: 1
          }
        },
        { $match: { is_delete: false } },
        { $sort: { code: 1 } }
      ])
      .toArray((err, docs) => {
        if (docs) {
          callback(docs);
        } else if (err) {
          callback(err);
        }
      });
  },
  readMenuOneById: (callback, id) => {
    db.collection("m_menu")
      .find({ _id: new ObjectID(id) })
      .toArray((err, docs) => {
        let m_menu = docs.map(row => {
          return new M_Menu(row);
        });
        if (err) {
          callback(err);
        } else {
          callback(m_menu);
        }
      });
  },
  createMenuHandler: (callback, data) => {
    let MenuData = new M_Menu(data);
    db.collection("m_menu").insertOne(data, (err, docs) => {
      callback(MenuData);
    });
  },
  updateMenuHandler: (callback, data, id) => {
    db.collection("m_menu").updateOne(
      { code: id },
      { $set: data },
      (err, docs) => {
        callback(data);
      }
    );
  },
  deleteMenuHandler: (callback, id) => {
    db.collection("m_menu").updateOne(
      { code: id },
      { $set: { is_delete: true } },
      (err, docs) => {
        callback(docs);
      }
    );
  },
  readMenuSidebar: callback => {
    db.collection("m_menu")
      .aggregate([
        {
          $lookup: {
            from: "m_menu",
            localField: "parent_id",
            foreignField: "code",
            as: "new"
          }
        },
        {
          $match: {
            parent_id: {
              $ne: null
            }
          }
        },
        {
          $group: {
            _id: "$new.name",
            name: {
              $push: "$name"
            },
            controller: {
              $push: "$controller"
            }
          }
        }
      ])
      .toArray((err, docs) => {
        let m_menu = docs.map(row => {
          return new M_Menu(row);
        });
        callback(m_menu);
      });
  },
  readMenuLastId: callback => {
    db.collection("m_menu")
      .find({})
      .sort({
        code: -1
      })
      .limit(1)
      .toArray((err, docs) => {
        let m_menu = docs.map(row => {
          return new M_Menu(row);
        });
        callback(m_menu);
      });
  }
};

module.exports = menuData;
