const moment = require("moment");
const ResponseHelper = require("../helpers/Response_Helper");
const dtl = require("../datalayers/T_Souvenir_Item_Data");
const ObjectId = require("mongodb").ObjectID;

const T_Souvenir_Data = {
  //GET TRANSACTION SOUVENIR
  readSouvenirAllHandler: (req, res, next) => {
    //console.log("disini");
    dtl.readSouvenirAllHandler(items => {
      ResponseHelper.sendResponse(res, 200, items);
      //console.log(JSON.stringify(items));
    });
  },

  //GET T SOUVENIR ITEM
  readSouvenirItemAllHandler: (req, res, next) => {
    dtl.readSouvenirItemAllHandler(function(items) {
      ResponseHelper.sendResponse(res, 200, items);
      //console.log(JSON.stringify(items));
    });
  },

  //GET TRANSACTION SOUVENIR BY ID
  readByIdHandler: (req, res, next) => {
    let id = req.params.souvenirId;
    dtl.readByIdHandler(items => {
      ResponseHelper.sendResponse(res, 200, items);
    }, id);
  },

  // SOUVENIR ITEM
  createHandlerItem: (req, res, next) => {
    const data = req.body;
    //console.log("ini data yang harus ke souvenir", data[0])
    //console.log("ini data yang harus ke souvenir item", data[1])
    let thisDate = new Date();
    //ambil masing-masing yy, mm, dd
    let date = thisDate.getDate().toString();
    let month = (thisDate.getMonth() + 1).toString();
    let year = thisDate
      .getFullYear()
      .toString()
      .substr(2, 2);
    let year1 = thisDate.getFullYear().toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (date.length == 1) {
      date = "0" + date;
    }
    //Untuk mendapatkan format yy.mm.dd
    //let newDate = "TRSV" + date + month + year;
    let newDate = "TRSV" + moment().format("DDMMYY");
    let CD = year1 + "-" + month + "-" + date;
    dtl.countCode(
      count => {
        let codeDate = newDate;
        for (let i = 0; i < 5 - (count + 1).toString().length; i++) {
          codeDate += "0";
        }
        codeDate += count + 1;
        data[0].code = codeDate;
        data[0].type = "Reduction";
        data[0].is_delete = false;
        data[0].created_date = moment().format("YYYY-MM-DD");
        const func = (input, code) => {
          return input.map(content => {
            content.t_souvenir_id = code;
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
    //console.log(req.body);
    // let thisDate = new Date();
    // ambil masing-masing yy, mm, dd
    // let date = thisDate.getDate().toStrisng();
    // let month = (thisDate.getMonth() + 1).toString();
    // let year = thisDate.getFullYear().toString().substr(2, 2);
    // let year1 = thisDate.getFullYear().toString();
    // if (month.length == 1) {
    //   month = "0" + month
    // }
    // //if date
    // if (date.length == 1) {
    //   date = "0" + date
    // }
    // let CD = year1 + "-" + month + "-" + date
    const id = req.params.souvenirId;
    const data = {
      request_due_date: req.body.souv.request_due_date,
      note: req.body.souv.note,
      updated_by: req.body.souv.updated_by,
      updated_date: moment().format("YYYY-MM-DD")
    };
    dtl.updateHandler(
      items => {
        dtl.readByIdHandler(oldData => {
          let dataOldFile = req.body.oldFile.map((content, idx) => {
            return {
              _id: new ObjectId(oldData[idx]._id),
              m_souvenir_id: content.m_souvenir_id,
              qty: content.qty,
              note: content.note,
              created_by: oldData[idx].created_by,
              created_date: oldData[idx].created_date,
              t_souvenir_id: oldData[idx].t_souvenir_id,
              is_delete: false,
              updated_by: data.updated_by,
              updated_date: moment().format("YYYY-MM-DD")
            };
          });
          dtl.deleteData(removeOldFile => {
            dtl.createItem(updateOldFile => {
              if (req.body.newFile.length > 0) {
                //console.log(req.body.newFile.length)
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
                    updated_date: moment().format("YYYY-MM-DD")
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

  // ADMIN APPROVE REQUEST
  approveHandler: (req, res, next) => {
    //console.log("admin Approve")
    //console.log(req.body);
    let id = req.params.souvenirId;
    const data = {
      //created_by: req.body.created_by,
      status: req.body.status,
      approved_by: req.body.approved_by,
      approved_date: req.body.approved_date
      //update_by: ""
    };
    dtl.approveHandler(
      items => {
        ResponseHelper.sendResponse(res, 200, items);
        //console.log(JSON.stringify(items))
      },
      data,
      id
    );
  },

  //ADMIN REJECT REQUEST
  rejectHandler: (req, res, next) => {
    //console.log("admin Reject")
    //console.log(req.body);
    let id = req.params.souvenirId;
    const data = {
      reject_reason: req.body.reject_reason,
      status: req.body.status
      //update_by: ""
    };
    dtl.rejectHandler(
      items => {
        ResponseHelper.sendResponse(res, 400, items);
        //console.log(JSON.stringify(items))
      },
      data,
      id
    );
  },

  // RECEIVED SOUVENIR REQUEST
  receivedHandler: (req, res, next) => {
    let id = req.params.souvenirId;
    const data = {
      status: req.body.status,
      received_by: req.body.received_by,
      received_date: req.body.received_date
    };
    dtl.receivedHandler(
      items => {
        ResponseHelper.sendResponse(res, 200, items);
      },
      data,
      id
    );
  },

  // SETTLEMENT SOUVENIR REQUEST
  settlementHandler: (req, res, next) => {
    console.log(JSON.stringify(req.body));
    let id = req.body.code;
    const status = {
      status: req.body.stat.status
    };
    const sett = {
      qty_settlement: req.body.sett
    };
    dtl.settlementHandler(
      items => {
        dtl.settlementItemHandler(
          item => {
            let message = [items, item];
            ResponseHelper.sendResponse(res, 200, message);
          },
          sett,
          id
        );
      },
      status,
      id
    );
  },

  // APPROVAL SETTLEMENT SOUVENIR REQUEST
  approveSettlementHandler: (req, res, next) => {
    //console.log("masukin lah");
    let id = req.params.souvenirId;
    //console.log(id);
    const data = {
      status: req.body.status,
      settlement_approved_by: req.body.settlement_approved_by,
      settlement_approved_date: req.body.settlement_approved_date
    };
    //console.log(JSON.stringify(data));
    dtl.approveSettlementHandler(
      items => {
        ResponseHelper.sendResponse(res, 200, items);
      },
      data,
      id
    );
  },

  closeOrderHandler: (req, res, next) => {
    let id = req.params.souvenirId;
    const data = {
      status: req.body.status
    };
    dtl.closeOrderHandler(
      items => {
        ResponseHelper.sendResponse(res, 200, items);
      },
      data,
      id
    );
  }

  //ADD TRANSACTION SOUVENIER
  // createHandler: (req, res, next) => {
  //   let thisDate = new Date();
  //   // ambil masing-masing yy, mm, dd
  //   let date = thisDate.getDate().toString();
  //   let month = (thisDate.getMonth() + 1).toString();
  //   let year = thisDate.getFullYear().toString().substr(2, 2);
  //   if (month.length == 1){
  //     month = "0" + month
  //   }
  //   if (date.length == 1){
  //     date = "0" + date
  //   }
  //   // Untuk mendapatkan format yy.mm.dd
  //   let newDate = "TRSV" + date + month + year;

  //   dtl.countCode(count => {
  //     let codeDate = newDate;
  //     for (let i = 0; i < 5 - (count + 1).toString().length; i++) {
  //       codeDate += '0';
  //     }
  //     codeDate += count + 1;

  //     const data = {
  //       code: codeDate,
  //       type: "Reduction",
  //       t_event_id: req.body.t_event_id,
  //       request_by: req.body.request_by,
  //       request_date: req.body.request_date,
  //       request_due_date: req.body.request_due_date,
  //       note: req.body.note,
  //       status: 1,
  //       is_delete: false,
  //       created_by: req.body.created_by,
  //       created_date: req.body.created_date
  //     }

  //     dtl.createHandler(function (items) {
  //       ResponseHelper.sendResponse(res, 200, items);
  //     }, data);
  //   }, newDate)
  // },
};

module.exports = T_Souvenir_Data;
