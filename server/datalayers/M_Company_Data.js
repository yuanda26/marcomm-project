const DB = require("../models/Database");
const ObjectID = require("mongodb").ObjectId;
const M_Company = require("../Models/M_Company_Model");

const db = DB.getConnection();
const dt = {
  //CRUD Company

  readCompanyAllHandlerData: callback => {
    db.collection("m_company")
      .aggregate([
        {
          $lookup: {
            from: "m_employee",
            localField: "created_by",
            foreignField: "employee_number",
            as: "creater"
          }
        },
        {
          $lookup: {
            from: "m_employee",
            localField: "created_by",
            foreignField: "employee_number",
            as: "updater"
          }
        },
        { $unwind: "$creater" },
        { $unwind: "$updater" },
        {
          $project: {
            code: "$code",
            name: "$name",
            address: "$address",
            phone: "$phone",
            email: "$email",
            is_delete: "$is_delete",
            created_by: {
              $concat: ["$creater.first_name", " ", "$creater.last_name"]
            },
            created_date: "$created_date",
            updated_by: {
              $concat: ["$updater.first_name", " ", "$updater.last_name"]
            },
            updated_date: "$updated_date",
            _id: 1
          }
        },
        { $match: { is_delete: false } },
        { $sort: { code: -1 } }
      ])
      .toArray((err, docs) => {
        callback(docs);
      });
  },

  readOneByIdCompanyData: callback => {
    db.collection("m_company")
      .find({ _id: new ObjectID(id) })
      .sort({ code: 1 })
      .toArray((err, docs) => {
        let m_company = docs.map(row => {
          return new M_Company(row);
        });
        callback(m_company);
      });
  },

  createCompanyHandlerData: (callback, data) => {
    let companyData = new M_Company(data);
    db.collection("m_company").insertOne(companyData, (err, docs) => {
      if (err) {
        callback(err);
      } else {
        callback(companyData);
      }
    });
  },

  updateCompanyHandlerData: (callback, code, data) => {
    db.collection("m_company").updateOne(
      { code: code },
      { $set: data },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(code);
        }
      }
    );
  },

  generateCompanyCode: callback => {
    db.collection("m_company")
      .find()
      .sort({ code: -1 })
      .limit(1)
      .toArray((err, docs) => {
        let m_company = docs.map(row => {
          return new M_Company(row);
        });
        callback(m_company);
      });
  },

  isUsed: (callback, id) => {
    db.collection("m_employee")
      .find({ $and: [{ m_company_id: id }, { is_delete: false }] })
      .toArray((err, docs) => {
        let user = docs.map(row => {
          return new M_Company(row);
        });
        callback(user);
      });
  }
};

module.exports = dt;
