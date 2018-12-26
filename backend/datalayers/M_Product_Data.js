const Database = require("../models/Database");
const M_Product = require("../models/M_Product_Model");
const db = Database.getConnection();

const productData = {
  //GET PRODUCT
  readAllHandlerData: callback => {
    db.collection("m_product")
      .find({ is_delete: false })
      .sort({ code: 1 })
      .toArray((err, products) => {
        if (err) {
          callback(err);
        } else {
          callback(products);
        }
      });
  },
  //GET PRODUCT BY ID
  readByIdHandler: (callback, id) => {
    db.collection("m_product")
      .find({ code: id })
      .sort({ code: 1 })
      .toArray((err, products) => {
        if (err) {
          callback(err);
        } else {
          callback(products);
        }
      });
  },
  //AUTO INCREMENT
  readLastId: callback => {
    db.collection("m_product")
      .find({})
      .sort({ code: -1 })
      .limit(1)
      .toArray((err, products) => {
        if (err) {
          callback(err);
        } else {
          callback(products);
        }
      });
  },
  //VALIDATION
  readByUsername: (callback, name) => {
    db.collection("m_product").findOne(
      { is_delete: false, name: name },
      (err, product) => {
        if (err) {
          callback(err);
        } else {
          callback(product);
        }
      }
    );
  },
  // SEARCH
  searchHandlerData: (
    callback,
    code,
    name,
    description,
    created_date,
    created_by
  ) => {
    let newName = name.toUpperCase();
    let newCode = code.toUpperCase();
    db.collection("m_product")
      .find({
        name: new RegExp(newName),
        code: new RegExp(newCode),
        description: new RegExp(description),
        created_date: new RegExp(created_date),
        created_by: new RegExp(created_by),
        is_delete: false
      })
      .toArray((err, docs) => {
        let productsData = docs.map(row => {
          return new M_Product(row);
        });

        if (err) {
          callback(err);
        } else {
          callback(productsData);
        }
      });
  },
  //POST PRODUCT
  createHandler: (callback, data) => {
    db.collection("m_product").insert(data, (err, docs) => {
      if (err) {
        callback(err);
      } else {
        callback(data);
      }
    });
  },
  //DELETE PRODUCT
  deleteHandler: (callback, code) => {
    db.collection("m_product").updateOne(
      { code: code },
      { $set: { is_delete: true } },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(docs);
        }
      }
    );
  },
  //EDIT PRODUCT
  updateHandler: (callback, data, code) => {
    db.collection("m_product").updateOne(
      { code: code },
      { $set: data },
      (err, docs) => {
        if (err) {
          callback(err);
        } else {
          callback(docs);
        }
      }
    );
  }
};

module.exports = productData;
