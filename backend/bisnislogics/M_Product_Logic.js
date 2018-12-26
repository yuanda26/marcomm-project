const ResponseHelper = require("../helpers/Response_Helper");
const dtl = require("../datalayers/M_Product_Data");

const M_Product_Data = {
  //GET PRODUCT TABLE
  readAllHandler: (req, res, next) => {
    console.log("disini");
    dtl.readAllHandlerData(items => {
      ResponseHelper.sendResponse(res, 200, items);
      //console.log(JSON.stringify(items))
    });
  },

  //GET PRODUCT BY ID
  readByIdHandler: (req, res, next) => {
    let id = req.params.productId;
    dtl.readByIdHandler(items => {
      ResponseHelper.sendResponse(res, 200, items);
    }, id);
  },

  //SEARCH
  searchHandler: (req, res, next) => {
    let code = req.params.Code;
    let name = req.params.Name;
    let description = req.params.Description;
    let created_date = req.params.createdDate;
    let created_by = req.params.createdBy;
    dtl.searchHandlerData(
      items => {
        ResponseHelper.sendResponse(res, 200, items);
      },
      code,
      name,
      description,
      created_date,
      created_by
    );
  },

  //ADD PRODUCT TABLE
  createHandler: (req, res, next) => {
    let name = req.body.name.toUpperCase();
    let thisDate = new Date();

    let date = thisDate.getDate().toString();
    let month = (thisDate.getMonth() + 1).toString();
    let year = thisDate.getFullYear().toString();

    if (month.length == 1) {
      month = "0" + month;
    }

    //if date
    if (date.length == 1) {
      date = "0" + date;
    }

    let create_date = year + "-" + month + "-" + date;

    dtl.readByUsername(docs => {
      if (docs) {
        ResponseHelper.sendResponse(res, 401, "PRODUCT SUDAH ADA");
      } else {
        dtl.readLastId(companies => {
          if (companies.length > 0) {
            let pattern = companies[0].code.substr(-4);
            let lastestCode = parseInt(pattern) + 1;
            let generatePattern = pattern.substr(
              0,
              pattern.length - lastestCode.toString().length
            );
            var newCode = "PR" + generatePattern + lastestCode;
          } else {
            var newCode = "PR0001";
          }

          const data = {
            code: newCode,
            name: req.body.name.toUpperCase(),
            description: req.body.description,
            is_delete: false,
            created_by: req.body.created_by,
            created_date: create_date
          };

          //console.log(data)

          dtl.createHandler(function(items) {
            ResponseHelper.sendResponse(res, 200, items);
          }, data);
        });
      }
    }, name);
  },

  //DELETE PRODUCT
  deleteHandler: (req, res, next) => {
    let id = req.params.productId;
    dtl.deleteHandler(items => {
      ResponseHelper.sendResponse(res, 200, items);
    }, id);
  },

  //EDIT PRODUCT
  updateHandler: (req, res, next) => {
    let id = req.params.productId;
    const data = {
      name: req.body.name.toUpperCase(),
      description: req.body.description,
      update_by: req.body.update_by,
      update_date: new Date()
    };
    dtl.updateHandler(
      items => {
        ResponseHelper.sendResponse(res, 200, items);
      },
      data,
      id
    );
  }
};

module.exports = M_Product_Data;
