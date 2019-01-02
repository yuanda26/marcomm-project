const responseHelper = require("../helpers/Response_Helper");
const promotionData = require("../datalayers/T_Promotion_Data");
const moment = require("moment");
const promotionItemFile = require("../datalayers/T_Promotion_Item_File_Data");
const promotionItem = require("../datalayers/T_Promotion_Item_Data");
const designItem = require("../datalayers/T_Design_Item_Data");
const multer = require("multer");
const path = require("path");
const ObjectId = require("mongodb").ObjectID;

class getFile {
  constructor(input, separator) {
    this.input = input;
    this.separator = separator;
    this.func = (a, b) => {
      return a.split(b);
    };
  }
  get getExtension() {
    let stepOne = this.func(this.input, this.separator);
    let stepTwo = stepOne[stepOne.length - 1];
    let extension = stepTwo.split(".");
    return extension[extension.length - 1];
  }
  get getName() {
    let stepOne = this.func(this.input, this.separator);
    let stepTwo = stepOne[stepOne.length - 1];
    return stepTwo.split("." + this.getExtension)[0];
  }
  get getAddress() {
    return this.func(this.input, this.separator)
      .filter(a => a !== this.getName + "." + this.getExtension)
      .join("\\");
  }
}

const generatorFile = (input, code) => {
  return input.map(content => {
    let theFile = new getFile(content.fileName, "\\");
    let item = {
      t_promotion_id: code,
      filename: theFile.getName,
      size: "30kb",
      extention: theFile.getExtension,
      start_date: null,
      end_date: null,
      request_due_date: content.dueDate,
      qty: content.qty,
      todo: content.todo,
      note: content.note,
      is_delete: false,
      created_by: content.created_by,
      created_date: moment().format("DD/MM/YYYY"),
      updated_by: null,
      updated_date: null
    };
    return item;
  });
};
const T_Promotion_Logic = {
  readAllPromotionHandler: (req, res, next) => {
    promotionData.readAllData(promotion => {
      responseHelper.sendResponse(res, 200, promotion);
    });
  },
  readByIdHandler: (req, res, next) => {
    const promotionId = req.params.promotionId;

    promotionData.readByIdData(promotion => {
      if (promotion) {
        responseHelper.sendResponse(res, 200, promotion);
      } else {
        responseHelper.sendResponse(
          res,
          404,
          "404. Transaction Promotion Data Not Found"
        );
      }
    }, promotionId);
  },
  readByPromotionID: (req, res, next) => {
    const code = req.params.code;
    const designCode = req.params.designCode;
    promotionItem.readByPromotionID(items => {
      designItem.readOne(data => {
        let newData = data.map((content, index) => {
          content.request_due_date = items[index].request_due_date;
          content.todo = items[index].todo;
          content.qty = items[index].qty;
          content.note = items[index].note;
          return content;
        });
        let message = [newData, items];
        responseHelper.sendResponse(res, 200, message);
      }, designCode);
    }, code);
  },
  createPromotionHandler: (req, res, next) => {
    promotionData.countData(len => {
      if (len > 0) {
        const protoCode = lent => {
          let lala = 0;
          for (let i = 0; i < 4 - lent.toString().length; i++) {
            lala = lala + "0";
          }
          return lala + (lent + 1);
        };
        var newCode = `TRWOMP${moment().format("DDMMYY")}${protoCode(len)}`;
      } else {
        var newCode = `TRWOMP${moment().format("DDMMYY")}00001`;
      }
      const today = moment().format("DD/MM/YYYY");

      let formdata = {
        code: newCode,
        flag_design: req.body[0].flag_design,
        title: req.body[0].title,
        t_event_id: req.body[0].t_event_id,
        t_design_id: req.body[0].t_design_id,
        request_by: req.body[0].request_by,
        request_date: today,
        approved_by: req.body[0].approved_by,
        approved_date: req.body[0].approved_date,
        assign_to: req.body.assign_to,
        close_date: req.body[0].close_date,
        note: req.body[0].note,
        status: 1,
        reject_reason: req.body[0].reject_reason,
        is_delete: false,
        created_by: req.body[0].created_by,
        created_date: today
      };

      promotionData.createData(items => {
        promotionData.readAllData(promotion => {
          promotionItemFile.createData(data => {
            responseHelper.sendResponse(res, 200, newCode);
          }, generatorFile(req.body[1], formdata.code));
        });
      }, formdata);
    });
  },

  updatePromotionHandler: (req, res, next) => {
    const promotionId = req.params.promotionId;
    const today = moment().format("DD/MM/YYYY");
    const data = {
      title: req.body.marketHeader.title,
      approved_by: req.body.marketHeader.approved_by,
      approved_date: req.body.marketHeader.approved_date,
      assign_to: req.body.marketHeader.assign_to,
      close_date: req.body.marketHeader.close_date,
      note: req.body.marketHeader.note,
      status: req.body.marketHeader.status,
      reject_reason: req.body.marketHeader.reject_reason,
      is_delete: false,
      updated_by: req.body.marketHeader.updated_by,
      updated_date: today
    };
    promotionData.updateData(
      items => {
        if (req.body.designItem === null) {
          promotionItemFile.readByPromotionData(lili => {
            console.log("ini data new file", req.body.dataNewFile);
            let dataForItemFile = req.body.oldFile.map((content, index) => {
              return {
                _id: new ObjectId(content._id),
                t_promotion_id: content.t_promotion_id,
                filename: content.filename,
                size: content.size,
                extention: content.extention,
                start_date: content.start_date,
                end_date: content.end_date,
                request_due_date: req.body.oldFile[index].request_due_date,
                qty: req.body.oldFile[index].qty,
                todo: req.body.oldFile[index].todo,
                note: req.body.oldFile[index].note,
                is_delete: false,
                created_by: content.created_by,
                created_date: content.created_date,
                updated_by: req.body.marketHeader.updated_by,
                updated_date: today
              };
            });
            promotionItemFile.deleteData(lulu => {
              promotionItemFile.createData(lele => {
                if (req.body.file.length == 0) {
                  responseHelper.sendResponse(res, 200, lili);
                } else {
                  let theFile = generatorFile(
                    req.body.file,
                    req.body.marketHeader.code
                  );
                  promotionItemFile.createData(samsul => {
                    responseHelper.sendResponse(res, 200, lili);
                  }, theFile);
                }
              }, dataForItemFile);
            }, req.body.marketHeader.code);
          }, req.body.marketHeader.code);
        } else {
          promotionItem.readByPromotionID(code => {
            console.log("ini data dari old file", req.body.dataOldFile);
            let newData = code.map((content, index) => {
              let data = {
                _id: new ObjectId(content._id),
                t_promotion_id: content.t_promotion_id,
                t_design_item_id: content.t_design_item_id,
                m_product_id: content.m_product_id,
                title: content.title,
                request_pic: content.request_pic,
                start_date: content.start_date,
                end_date: content.end_date,
                request_due_date: req.body.designItem[index].request_due_date,
                qty: req.body.designItem[index].qty,
                todo: req.body.designItem[index].todo,
                note: req.body.designItem[index].note,
                is_delete: false,
                created_by: content.created_by,
                created_date: content.created_date,
                updated_by: req.body.marketHeader.updated_by,
                updated_date: today
              };
              return data;
            });
            promotionItem.deleteData(lala => {
              promotionItem.createManyData(theData => {
                //start for promotion item file
                promotionItemFile.readByPromotionData(lili => {
                  let dataForItemFile = req.body.oldFile.map(
                    (content, index) => {
                      return {
                        _id: new ObjectId(content._id),
                        t_promotion_id: content.t_promotion_id,
                        filename: content.filename,
                        size: content.size,
                        extention: content.extention,
                        start_date: content.start_date,
                        end_date: content.end_date,
                        request_due_date:
                          req.body.oldFile[index].request_due_date,
                        qty: req.body.oldFile[index].qty,
                        todo: req.body.oldFile[index].todo,
                        note: req.body.oldFile[index].note,
                        is_delete: false,
                        created_by: content.created_by,
                        created_date: content.created_date,
                        updated_by: req.body.marketHeader.updated_by,
                        updated_date: today
                      };
                    }
                  );
                  promotionItemFile.deleteData(lulu => {
                    promotionItemFile.createData(lele => {
                      if (req.body.file.length == 0) {
                        responseHelper.sendResponse(res, 200, lili);
                      } else {
                        let theFile = generatorFile(
                          req.body.file,
                          req.body.marketHeader.code
                        );
                        promotionItemFile.createData(samsul => {
                          responseHelper.sendResponse(res, 200, lili);
                        }, theFile);
                      }
                    }, dataForItemFile);
                  }, req.body.marketHeader.code);
                }, req.body.marketHeader.code);
                //end for promotion itemfile
              }, newData);
            }, req.body.marketHeader.code);
          }, req.body.marketHeader.code);
        }
        //start for edit promotion with design

        //end for edit promotion with design
      },
      data,
      promotionId
    );
  },
  deletePromotionHandler: (req, res, next) => {
    let id = req.params.promotionId;
    promotionData.deleteData(items => {
      responseHelper.sendResponse(res, 200, items);
    }, id);
  },
  handlerAddWithDesign: (req, res, next) => {
    promotionData.countData(len => {
      if (len > 0) {
        const protoCode = lent => {
          let lala = 0;
          for (let i = 0; i < 4 - lent.toString().length; i++) {
            lala = lala + "0";
          }
          return lala + (lent + 1);
        };
        var newCode = `TRWOMP${moment().format("DDMMYY")}${protoCode(len)}`;
      } else {
        var newCode = `TRWOMP${moment().format("DDMMYY")}00001`;
      }
      const today = moment().format("DD/MM/YYYY");
      let dataMarketHeader = {
        code: newCode,
        flag_design: req.body.marketHeader.flag_design,
        title: req.body.marketHeader.title,
        t_event_id: req.body.marketHeader.t_event_id,
        t_design_id: req.body.marketHeader.t_design_id,
        request_by: req.body.marketHeader.request_by,
        request_date: today,
        approved_by: req.body.designHeader.approved_by,
        approved_date: req.body.designHeader.approved_date,
        assign_to: req.body.designHeader.assign_to,
        close_date: req.body.designHeader.close_date,
        note: req.body.marketHeader.note,
        status: 1,
        reject_reason: req.body.designHeader.reject_reason,
        is_delete: false,
        created_by: req.body.marketHeader.created_by,
        created_date: today
      };
      let dataDesignItem = req.body.designItem.map(content => {
        return {
          t_promotion_id: newCode,
          t_design_item_id: req.body.marketHeader.t_design_id,
          m_product_id: content.m_product_id,
          title: content.title_item,
          request_pic: req.body.marketHeader.request_by,
          start_date: null,
          end_date: null,
          request_due_date: content.dueDate,
          qty: content.qty,
          todo: content.todo,
          note: content.note,
          is_delete: false,
          created_by: req.body.marketHeader.created_by,
          created_date: today,
          updated_by: null,
          updated_date: null
        };
      });

      promotionData.createData(data1 => {
        promotionItem.createManyData(data2 => {
          if (req.body.file == 0) {
            responseHelper.sendResponse(res, 200, newCode);
          } else {
            let itemFileUpload = generatorFile(req.body.file, newCode);
            promotionItemFile.createData(data3 => {
              responseHelper.sendResponse(res, 200, newCode);
            }, itemFileUpload);
          }
        }, dataDesignItem);
      }, dataMarketHeader);
    });
  }
};
module.exports = T_Promotion_Logic;
