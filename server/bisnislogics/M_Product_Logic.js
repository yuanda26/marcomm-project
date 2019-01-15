const ResponseHelper = require("../helpers/Response_Helper");
const productData = require("../datalayers/M_Product_Data");

const M_Product_Data = {
  //GET PRODUCT TABLE
  readAllHandler: (req, res, next) => {
    productData.readAllHandlerData(items => {
      ResponseHelper.sendResponse(res, 200, items);
    });
  },
  //GET PRODUCT BY ID
  readByIdHandler: (req, res, next) => {
    let code = req.params.productId;
    productData.readByIdHandler(items => {
      ResponseHelper.sendResponse(res, 200, items);
    }, code);
  },
  //SEARCH
  searchHandler : (req, res, next) => {
    let empId = req.params.empId;
    let empName = req.params.empName;
    let company = req.params.company;
    let createdDate = req.params.createdDate;
    let createdBy = req.params.createdBy;
    
  },
  searchHandler: (req, res, next) => {
    let code = req.params.Code;
    let name = req.params.Name;
    let description = req.params.Description;
    let created_date = req.params.createdDate;
    let createdBy = req.params.createdBy;
    productData.getUser((user) => {
      let created_by = "";
      user === null || user === undefined ? ( created_by = createdBy ) : ( created_by = user.m_employee_id )
        productData.searchHandlerData((items) => {
          ResponseHelper.sendResponse(res, 200, items);
        }, code, name, description, created_date, created_by)
      }, createdBy)
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

    productData.readByUsername(docs => {
      if (docs) {
        ResponseHelper.sendResponse(res, 401, "PRODUCT SUDAH ADA");
      } else {
        productData.readLastId(companies => {
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

          productData.createHandler(items => {
            ResponseHelper.sendResponse(res, 200, items);
          }, data);
        });
      }
    }, name);
  },
  //DELETE PRODUCT
  deleteHandler: (req, res, next) => {
    let code = req.params.productId;
    productData.deleteHandler(items => {
      ResponseHelper.sendResponse(res, 200, items);
    }, code);
  },
  //EDIT PRODUCT
  updateHandler: (req, res, next) => {
    let code = req.params.productId;
    const data = {
      name: req.body.name.toUpperCase(),
      description: req.body.description,
      update_by: req.body.update_by,
      update_date: new Date()
    };

    productData.updateHandler(
      items => {
        ResponseHelper.sendResponse(res, 200, items);
      },
      data,
      code
    );
  }
};

module.exports = M_Product_Data;
