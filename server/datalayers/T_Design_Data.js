const Database = require("../models/Database");
const ObjectId = require("mongodb").ObjectID;
const M_Design = require("../models/T_Design_Model");
const T_Design_Item = require("../models/T_Design_Item_Model");
const T_Design_File = require("../models/T_Design_Item_File_Model");

const db = Database.getConnection();
const designData = {
  readAllData: (callback, roleId, employeeId) => {
    // Show Local Field Based on Role Id
    const localField = roleId === "RO0005" ? "created_by" : "assign_to";

    // Show Result Based on Role ID
    if (roleId !== "RO0001") {
      db.collection("t_design")
        .aggregate([
          {
            $lookup: {
              from: "m_employee",
              localField: localField,
              foreignField: "employee_number",
              as: "employee"
            }
          },
          { $unwind: "$employee" },
          { $match: { "employee.employee_number": employeeId } },
          {
            $project: {
              employee: 0
            }
          }
        ])
        .sort({ code: -1 })
        .toArray((err, designs) => {
          // Return Data to Callback
          if (err) {
            callback(err);
          } else {
            callback(designs);
          }
        });
    } else {
      db.collection("t_design")
        .find()
        .sort({ code: -1 })
        .toArray((err, designs) => {
          // Return Data to Callback
          if (err) {
            callback(err);
          } else {
            callback(designs);
          }
        });
    }
  },
  readByCodeData: (callback, code) => {
    db.collection("t_design").findOne(
      { is_delete: false, code: code },
      (err, design) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(design);
        }
      }
    );
  },
  createData: (callback, formdata) => {
    let designData = new M_Design(formdata);
    db.collection("t_design").insertOne(designData, (err, design) => {
      // Return Data to Callback
      if (err) {
        callback(err);
      } else {
        callback(designData);
      }
    });
  },
  updateData: (callback, code, updateDesign) => {
    db.collection("t_design").updateOne(
      { code: code },
      { $set: updateDesign },
      (err, souvenir) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(updateDesign);
        }
      }
    );
  },
  readDesignItemById: (callback, id) => {
    db.collection("t_design_item")
      .find({ is_delete: false, _id: new ObjectId(id) })
      .sort({ t_design_id: 1 })
      .toArray((err, docs) => {
        let item = docs.map(row => {
          return new T_Design_Item(row);
        });
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(item);
        }
      });
  },
  approveDesign: (callback, data, code) => {
    db.collection("t_design").updateOne(
      { code: code },
      { $set: data },
      (err, docs) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(data);
        }
      }
    );
  },
  rejectDesign: (callback, data, code) => {
    db.collection("t_design").updateOne(
      { code: code },
      { $set: data },
      (err, docs) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(data);
        }
      }
    );
  },
  closeRequestData: (callback, formdata) => {
    let closeData = formdata.map(data => new T_Design_File(data));

    db.collection("t_design_item_file").insertMany(closeData, (err, docs) => {
      // Return Data to Callback
      if (err) {
        callback(err);
      } else {
        callback(closeData);
      }
    });
  },
  readFilesById: (callback, ItemId) => {
    db.collection("t_design_item_file")
      .find({ is_delete: false, t_design_item_id: ItemId })
      .sort({ t_design_item_id: 1 })
      .toArray((err, docs) => {
        let file = docs.map(row => {
          return new T_Design_File(row);
        });
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(file);
        }
      });
  },
  lastCodeData: callback => {
    db.collection("t_design")
      .find({})
      .sort({ code: -1 })
      .limit(1)
      .toArray((err, docs) => {
        let t_design = docs.map(doc => {
          return new M_Design(doc);
        });
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(t_design);
        }
      });
  },
  getRequesterData: callback => {
    db.collection("m_employee")
      .aggregate([
        {
          $lookup: {
            from: "m_user",
            localField: "employee_number",
            foreignField: "m_employee_id",
            as: "user"
          }
        },
        {
          $lookup: {
            from: "m_role",
            localField: "user.m_role_id",
            foreignField: "code",
            as: "role"
          }
        },
        {
          $match: { "role.name": "Requester" }
        },
        {
          $project: {
            _id: 1,
            first_name: "$first_name",
            last_name: "$last_name",
            employee_number: "$employee_number"
          }
        }
      ])
      .sort({ employee_number: 1 })
      .toArray((err, requester) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(requester);
        }
      });
  },
  getStaffData: callback => {
    db.collection("m_employee")
      .aggregate([
        {
          $lookup: {
            from: "m_user",
            localField: "employee_number",
            foreignField: "m_employee_id",
            as: "user"
          }
        },
        {
          $lookup: {
            from: "m_role",
            localField: "user.m_role_id",
            foreignField: "code",
            as: "role"
          }
        },
        {
          $match: { "role.name": "Staff" }
        },
        {
          $project: {
            _id: 1,
            first_name: "$first_name",
            last_name: "$last_name",
            employee_number: "$employee_number"
          }
        }
      ])
      .sort({ employee_number: 1 })
      .toArray((err, staff) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(staff);
        }
      });
  }
};

module.exports = designData;
