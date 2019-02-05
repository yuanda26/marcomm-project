const Database = require("../models/Database");
const ObjectId = require("mongodb").ObjectID;
const T_Design_Item = require("../models/T_Design_Item_Model");

const db = Database.getConnection();
const designDataItem = {
  readAllItemData: (callback, code) => {
    db.collection("t_design_item")
      .find({
        t_design_id: code,
        is_delete: false
      })
      .sort({ request_due_date: 1 })
      .toArray((err, items) => {
        callback(items);
      });
  },
  createData: (callback, designItemData) => {
    const newData = designItemData.map(data => new T_Design_Item(data));

    db.collection("t_design_item").insertMany(newData, (err, design) => {
      // Return Data to Callback
      if (err) {
        callback(err);
      } else {
        callback(newData);
      }
    });
  },
  readByIdData: (callback, itemId) => {
    db.collection("t_design_item").findOne(
      { is_delete: false, _id: new ObjectId(itemId) },
      (err, item) => {
        callback(item);
      }
    );
  },
  updateItemData: (callback, formdata) => {
    // Make a Copy of Updated Items Data
    const updatedData = [];
    // Alter Object Id to Another Array
    const _ids = [];
    formdata.forEach(data => {
      _ids.push(new ObjectId(data._id));
      updatedData.push({ ...data });
      delete data._id;
    });

    // Update Items Data
    const cb = [];
    _ids.forEach((id, index) => {
      db.collection("t_design_item").updateOne(
        { _id: id },
        { $set: formdata[index] },
        (err, item) => {
          if (err) {
            cb.push(err);
          } else {
            cb.push(item);
          }
        }
      );
    });

    //return callback
    callback(updatedData);
  },
  deleteData: (callback, itemId, deleteItem) => {
    db.collection("t_design_item").updateOne(
      { _id: new ObjectId(itemId) },
      { $set: deleteItem },
      (err, item) => {
        callback(deleteItem);
      }
    );
  },
  // read by code design added by: randika alditia
  readOne: (callback, code) => {
    db.collection("t_design_item")
      .aggregate([
        {
          $lookup: {
            from: "m_product",
            localField: "m_product_id",
            foreignField: "code",
            as: "product_doc"
          }
        },
        { $unwind: "$product_doc" },
        {
          $project: {
            t_design_id: "$t_design_id",
            m_product_id: "$m_product_id",
            product_name: "$product_doc.name",
            description: "$product_doc.description",
            title_item: "$title_item"
          }
        },
        { $match: { t_design_id: code } }
      ])
      .toArray((err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(docs);
        }
      });
  }
};

module.exports = designDataItem;
