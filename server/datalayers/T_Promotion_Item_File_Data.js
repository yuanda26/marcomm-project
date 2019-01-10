const Database = require("../models/Database");
const ObjectId = require("mongodb").ObjectID;
const M_Promotion = require("../models/T_Promotion_Item_File_Model");

const db = Database.getConnection();
const promotionData = {
  readAllData: callback => {
    db.collection("t_promotion_item_file")
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
    db.collection("t_promotion_item_file").findOne(
      { is_delete: false, _id: new ObjectId(promotionId) },
      (err, docs) => {
        callback(docs);
      }
    );
  },
  readByPromotionData: (callback, code) => {
    db.collection("t_promotion_item_file")
      .find({ is_delete: false, t_promotion_id: code })
      .toArray((err, docs) => {
        callback(docs);
      });
  },
  createData: (callback, formdata) => {
    db.collection("t_promotion_item_file").insertMany(formdata, (err, docs) => {
      callback(docs);
    });
  },
  updateData: (callback, updatePromotion, promotionId) => {
    db.collection("t_promotion_item_file").updateOne(
      { _id: new ObjectId(promotionId) },
      { $set: updatePromotion },
      (err, docs) => {
        callback(docs);
      }
    );
  },
  deleteData: (callback, id) => {
    db.collection("t_promotion_item_file").remove(
      { t_promotion_id: id },
      (err, docs) => {
        callback(docs);
      }
    );
  }
};

module.exports = promotionData;
