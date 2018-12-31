const Database = require("../models/Database");
const ObjectId = require("mongodb").ObjectID;
const M_Unit = require("../models/M_Unit_Model");
const db = Database.getConnection();
const unitData = {
  readAllUnit: callback => {
    db.collection("m_unit")
      .find({ is_delete: false })
      .sort({ code: 1 })
      .toArray((err, docs) => {
        let units = docs.map(row => {
          return new M_Unit(row);
        });
        if (err) {
          callback(err);
        } else {
          callback(units);
        }
      });
  },
  readOneById: (callback, unitId) => {
    db.collection("m_unit").findOne(
      { is_delete: false, _id: new ObjectId(unitId) },
      (err, unit) => {
        if (err) {
          callback(err);
        } else {
          callback(unit);
        }
      }
    );
  },
  createUnit: (callback, data, hasil) => {
    let kode = "UN";
    hasil++;
    for (i = 0; i < 4 - hasil.toString().length; i++) {
      kode += "0";
    }
    kode += hasil;

    let newUnit = new M_Unit(data);
    newUnit.code = kode;

    // Save New Unit to Database
    db.collection("m_unit").insertOne(newUnit, (err, docs) => {
      callback(newUnit);
    });
  },
  countAll: callback => {
    db.collection("m_unit").estimatedDocumentCount((err, docs) =>
      callback(docs)
    );
  },
  updateUnit: (callback, data, unitId) => {
    db.collection("m_unit").updateOne(
      { _id: new ObjectId(unitId) },
      { $set: data },
      (err, docs) => {
        callback(data);
      }
    );
  },
  deleteUnit: (callback, unitId) => {
    db.collection("m_unit").updateOne(
      { _id: new ObjectId(unitId) },
      { $set: { is_delete: true } },
      (err, docs) => {
        callback(unitId);
      }
    );
  }
};

module.exports = unitData;
