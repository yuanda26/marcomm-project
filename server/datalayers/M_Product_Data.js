const Database = require("../models/Database");
const M_Product = require("../models/M_Product_Model");
const db = Database.getConnection();

const productData = {
  //GET PRODUCT
  readAllHandlerData: callback => {
    db.collection("m_product")
      .aggregate([
      {
        $lookup : {
          from: "m_user",
          localField: "created_by",
          foreignField: "m_employee_id",
          as: "user"
        }
      }, { $unwind : "$user"},
      { $match : { "is_delete" : false}},
      { $sort : { code : -1 }},
      {
        $project: {
          _id         : "$_id",
          code        : "$code",
          name        : "$name",
          description : "$description",
          is_delete   : "$is_delete",
          created_by  : "$user.username",
          created_date: "$created_date",
          update_by   : "$update_by",
          update_date : "$update_date"
        }
      }
      ]).toArray((err, products) => {
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
  //Get User
  getUser : (callback, param) => {
    if(param === "") {
      callback(param)     
    }else{
      db.collection('m_user').findOne({ username : new RegExp(param), is_delete : false }, (err, docs) => {
        if(err){
          callback("")
        }else{
          callback(docs)
        }
      })
    }
  },
  // SEARCH
  searchHandlerData: (callback, code, name, description, created_date, created_by
  ) => {
    let newName = name.toUpperCase();
    let newCode = code.toUpperCase();
    db.collection("m_product")
      .aggregate([
      {
        $match : {
          name: new RegExp(newName),
          code: new RegExp(newCode),
          description: new RegExp(description),
          created_date: new RegExp(created_date),
          created_by: new RegExp(created_by),
          is_delete: false
        }
      },
      {
        $lookup : {
          from: "m_user",
          localField: "created_by",
          foreignField: "m_employee_id",
          as: "user"
        }
      }, { $unwind : "$user"},
      { $sort : { code : -1 }},
      {
        $project: {
          _id         : "$_id",
          code        : "$code",
          name        : "$name",
          description : "$description",
          is_delete   : "$is_delete",
          created_by  : "$user.username",
          created_date: "$created_date",
          update_by   : "$update_by",
          update_date : "$update_date"
        }
      }
      ]).toArray((err, products) => {
        if (err) {
          callback(err);
        } else {
          callback(products);
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
