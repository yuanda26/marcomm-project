const ResponseHelper = require("../helpers/Response_Helper");
const dtl = require("../datalayers/T_Souvenir_Data");
const dti = require("../datalayers/T_Souvenir_Item_Data");
const ObjectId = require("mongodb").ObjectID;
const moment = require("moment");

const T_Souvenir_Data = {
  //GET TRANSACTION SOUVENIR
  readAllHandler: (req, res, next) => {
    dtl.readSouvenirAllHandler(items => {
      ResponseHelper.sendResponse(res, 200, items);
    });
  },
  //GET TRANSACTION SOUVENIR BY ID
  readByIdHandler: (req, res, next) => {
    let id = req.params.souvenirId;
    dtl.readByIdHandler(items => {
      ResponseHelper.sendResponse(res, 200, items);
    }, id);
  },

  //DELETE TRANSACTION SOUVENIR
  deleteHandler: (req, res, next) => {
    let id = req.params.souvenirId;
    dtl.deleteHandler(items => {
      ResponseHelper.sendResponse(res, 200, items);
    }, id);
  },

  //EDIT TRANSACTION SOUVENIR
  updateHandler: (req, res, next) => {
    let CD = moment().format("YYYY-MM-DD");
    const id = req.params.souvenirId;
    const data = {
      received_by: req.body.souv.received_by,
      received_date: req.body.souv.received_date,
      note: req.body.souv.note,
      updated_by: req.body.souv.updated_by,
      updated_date: CD
    };
    dtl.updateHandler(
      items => {
        dti.readByIdHandler(const1 => {
          let dataOldFile = req.body.oldFile.map((content, idx) => {
            return {
              _id: new ObjectId(const1[idx]._id),
              m_souvenir_id: content.m_souvenir_id,
              qty: content.qty,
              note: content.note,
              created_by: const1[idx].created_by,
              created_date: const1[idx].created_date,
              t_souvenir_id: const1[idx].t_souvenir_id,
              is_delete: false,
              updated_by: data.updated_by,
              updated_date: CD
            };
          });
          dtl.deleteData(deleteitem => {
            dtl.createItem(updateOldFile => {
              if (req.body.newFile.length > 0) {
                dataNewFile = req.body.newFile.map((ele, idx) => {
                  return {
                    m_souvenir_id: ele.m_souvenir_id,
                    qty: ele.qty,
                    note: ele.note,
                    created_date: req.body.oldFile[idx].created_date,
                    created_by: req.body.oldFile[idx].created_by,
                    t_souvenir_id: req.body.oldFile[idx].t_souvenir_id,
                    is_delete: false,
                    updated_by: data.updated_by,
                    updated_date: CD
                  };
                });
                dtl.createItem(createNewFile => {
                  ResponseHelper.sendResponse(res, 200, createNewFile);
                }, dataNewFile);
              } else {
                ResponseHelper.sendResponse(res, 200, updateOldFile);
              }
            }, dataOldFile);
          }, req.body.souv.code);
        }, req.body.souv.code);
      },
      data,
      id
    );
  },

  // SOUVENIR ITEM
  createHandlerItem: (req, res, next) => {
    const data = req.body;
    let newDate = "TRSV" + moment().format("DDMMYY");
    let CD = moment().format("YYYY-MM-DD");
    dtl.countCode(
      count => {
        let codeDate = newDate;
        for (let i = 0; i < 5 - (count + 1).toString().length; i++) {
          codeDate += "0";
        }
        codeDate += count + 1;
        data[0].code = codeDate;
        data[0].type = "Additional";
        data[0].is_delete = false;
        data[0].created_date = moment().format("YYYY-MM-DD");
        const func = (input, code) => {
          return input.map(content => {
            content.t_souvenir_id = code;
            content.created_date = moment().format("YYYY-MM-DD");
            content.is_delete = false;
            return content;
          });
        };
        dtl.createHandler(function(items) {
          dtl.createItem(item => {
            let message = [items, item];
            ResponseHelper.sendResponse(res, 200, message);
          }, func(data[1], codeDate));
        }, data[0]);
      },
      newDate,
      CD
    );
  }
};

module.exports = T_Souvenir_Data;
