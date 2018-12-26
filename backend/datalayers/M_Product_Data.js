const DB = require("../Models/db");
const ObjectID = require("mongodb").ObjectID;
const M_product = require("../models/M_Product_Model")
const db = DB.getConnection()
const dt = {
    //GET PRODUCT
    readAllHandlerData: callback => {
        db.collection("m_product")
          .find({ is_delete: false })
          .sort({ code: 1 })
          .toArray((err, docs) => {
            let m_product = docs.map(row => {
              return new M_product(row);
            });
            callback(m_product);
        });
    },

    //GET PRODUCT BY ID
    readByIdHandler: (callback, id) => {
        db.collection("m_product")
          .find({ code: id })
          .sort({ code: 1 })
          .toArray((err, docs) => {
            let m_product = docs.map(row => {
              return new M_product(row);
            });
            callback(m_product);
          });
      },

    //AUTO INCREMENT
    readLastId: callback => {
        db.collection("m_product")
          .find({})
          .sort({ code: -1 })
          .limit(1)
          .toArray((err, docs) => {
            let m_product = docs.map(row => {
              return new M_product(row);
            });
            callback(m_product);
        });
    },

    //VALIDATION
    readByUsername: (callback, name) => {
      db.collection("m_product").findOne(
        { is_delete: false, name: name },
        (err, docs) => {
          callback(docs);
        }
      );
    },

    // SEARCH
    searchHandlerData : (callback, code, name, description, created_date, created_by) => {
      let newName = name.toUpperCase()
      let newCode = code.toUpperCase()
      db.collection('m_product').find({
          name : new RegExp(newName), 
          code : new RegExp(newCode), 
          description : new RegExp(description),
          created_date : new RegExp(created_date), 
          created_by : new RegExp(created_by), 
          is_delete : false
        }).toArray((err, docs) => {
          let m_product = docs.map(row => {
            return new M_product(row);
          });
        callback(m_product);
      })
    },

    //POST PRODUCT
    createHandler: (callback, data) => {
        db.collection("m_product").insert(data, (err, docs) => {
          callback(data);
        });
    },

    //DELETE PRODUCT
    deleteHandler: (callback, id) => {
        db.collection("m_product").updateOne(
          { code: id },
          { $set: { is_delete: true } },
          (err, docs) => {
            callback(docs);
          }
        );
    },

    //EDIT PRODUCT
    updateHandler: (callback, data, id) => {
        //console.log(data);
        db.collection("m_product").updateOne(
          { code: id },
          { $set: data },
          (err, docs) => {
            callback(docs);
          }
        );
      },
}

module.exports = dt