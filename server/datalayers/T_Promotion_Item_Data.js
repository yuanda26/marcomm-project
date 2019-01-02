const Database = require("../models/Database");
const ObjectId = require("mongodb").ObjectID;
const M_Promotion = require("../models/T_Promotion_Item_Model");

const db = Database.getConnection();
const promotionData = {
  readAllData: callback => {
    db.collection("t_promotion_item")
      .find({ is_delete: false })
      .sort({ code: 1 })
      .toArray((err, docs) => {
        let tPromotion = docs.map(row => {
          return new M_Promotion(row);
        });
        callback(tPromotion);
      });
  },
  readByIdData: (callback, promotionId) => {
    db.collection("t_promotion_item").findOne(
      { is_delete: false, _id: new ObjectId(promotionId) },
      (err, docs) => {
        callback(docs);
      }
    );
  },
  readByPromotionID: (callback, code) => {
    db.collection("t_promotion_item")
      .find({ is_delete: false, t_promotion_id: code })
      .toArray((err, docs) => {
        callback(docs);
      });
  },
  createData: (callback, formdata) => {
    let promotionData = new M_Promotion(formdata);
    db.collection("t_promotion_item").insertOne(promotionData, (err, docs) => {
      callback(docs);
    });
  },
  updateData: (callback, updatePromotion, promotionId) => {
    db.collection("t_promotion_item").updateOne(
      { _id: new ObjectId(promotionId) },
      { $set: updatePromotion },
      (err, docs) => {
        callback(docs);
      }
    );
  },
  deleteData: (callback, whatDelete) => {
    db.collection("t_promotion_item").remove({t_promotion_id: whatDelete},(err, docs) => {
        callback(docs);
      });
  },
  createManyData: (callback, data) => {
    db.collection("t_promotion_item").insertMany(data, (err, docs) => {
      callback(docs);
    });
  }
};

module.exports = promotionData;
