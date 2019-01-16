const Database = require("../models/Database");
const M_Souvenir = require("../models/M_Souvenir_Model");

const db = Database.getConnection();

const souvenirData = {
  readAllSouvenir: callback => {
    db.collection("m_souvenir")
      .find({ is_delete: false })
      .sort({ code: -1 })
      .toArray((err, souvenirs) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(souvenirs);
        }
      });
  },
  readByCodeSouvenir: (callback, code) => {
    db.collection("m_souvenir").findOne(
      { is_delete: false, code: code },
      (err, souvenir) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(souvenir);
        }
      }
    );
  },
  createSouvenir: (callback, newSouvenir) => {
    let SouvenirData = new M_Souvenir(newSouvenir);
    db.collection("m_souvenir").insertOne(SouvenirData, (err, souvenir) => {
      // Return Data to Callback
      if (err) {
        callback(err);
      } else {
        callback(SouvenirData);
      }
    });
  },
  updateSouvenir: (callback, code, updateSouvenir) => {
    db.collection("m_souvenir").updateOne(
      { code: code },
      { $set: updateSouvenir },
      (err, souvenir) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(updateSouvenir);
        }
      }
    );
  },
  deleteSouvenir: (callback, code, deleteSouvenir) => {
    db.collection("m_souvenir").updateOne(
      { code: code },
      { $set: deleteSouvenir },
      (err, souvenir) => {
        // Callback Data
        deleteSouvenir.code = code;
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(deleteSouvenir);
        }
      }
    );
  },
  lastCodeSouvenir: callback => {
    db.collection("m_souvenir")
      .find({})
      .sort({ code: -1 })
      .limit(1)
      .toArray((err, souvenirs) => {
        let mSouvenir = souvenirs.map(doc => {
          return new M_Souvenir(doc);
        });
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(mSouvenir);
        }
      });
  },
  isRelatedWithTransaction: (callback, code) => {
    db.collection("m_souvenir")
      .aggregate([
        {
          $lookup: {
            from: "t_souvenir_item",
            localField: "code",
            foreignField: "m_souvenir_id",
            as: "items"
          }
        },
        {
          $match: { "items.m_souvenir_id": code }
        }
      ])
      .toArray((err, item) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          callback(item);
        }
      });
  },
  isNameRelated: (callback, name, code) => {
    db.collection("m_souvenir")
      .find({
        $and: [
          { code: { $ne: code } },
          { is_delete: false },
          { name: { $regex: name } }
        ]
      })
      .toArray((err, souvenir) => {
        // Return Data to Callback
        if (err) {
          callback(err);
        } else {
          const names = [];
          souvenir.map(item => {
            let newName = item.name.split(" ")[0];
            names.push({ name: newName });
          });
          callback(names);
        }
      });
  }
};

module.exports = souvenirData;
