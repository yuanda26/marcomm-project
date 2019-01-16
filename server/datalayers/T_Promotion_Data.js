const Database = require("../models/Database");
const ObjectId = require("mongodb").ObjectID;
const M_Promotion = require("../models/T_Promotion_Model");

const db = Database.getConnection();
const promotionData = {
  readAllData: callback => {
    db.collection("t_promotion")
      .find({ is_delete: false })
      .sort({ code: -1 })
      .toArray((err, docs) => {
        let tPromotion = docs.map(row => {
          return new M_Promotion(row);
        });
        callback(tPromotion);
      });
  },
  readByIdData: (callback, promotionId) => {
    db.collection("t_promotion").findOne(
      { is_delete: false, _id: new ObjectId(promotionId) },
      (err, docs) => {
        callback(docs);
      }
    );
  },
  createData: (callback, formdata) => {
    let promotionData = new M_Promotion(formdata);
    db.collection("t_promotion").insertOne(promotionData, (err, docs) => {
      callback(docs);
    });
  },
  updateData: (callback, updatePromotion, promotionId) => {
    db.collection("t_promotion").updateOne(
      { _id: new ObjectId(promotionId) },
      { $set: updatePromotion },
      (err, docs) => {
        callback(docs);
      }
    );
  },
  lastCodeData: callback => {
    db.collection("t_promotion")
      .find({})
      .sort({ code: -1 })
      .limit(1)
      .toArray((err, docs) => {
        let t_promotion = docs.map(doc => {
          return new M_Promotion(doc);
        });
        callback(t_promotion);
      });
  },
  countData: callback => {
    db.collection("t_promotion").count((err, docs) => {
      callback(docs);
    });
  },
  deleteData: (callback, id) => {
    db.collection("t_promotion").updateOne(
      { _id: new ObjectId(id) },
      { $set: { is_delete: true } },
      (err, docs) => {
        callback(docs);
      }
    );
  }
};

module.exports = promotionData;
