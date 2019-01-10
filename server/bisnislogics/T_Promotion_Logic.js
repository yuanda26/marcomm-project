const responseHelper = require("../helpers/Response_Helper");
const promotionData = require("../datalayers/T_Promotion_Data");
const moment = require("moment");
const promotionItemFile = require("../datalayers/T_Promotion_Item_File_Data");
const promotionItem = require("../datalayers/T_Promotion_Item_Data");
const designItem = require("../datalayers/T_Design_Item_Data");
const multer = require("multer");
const path = require("path");
const ObjectId = require("mongodb").ObjectID;

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
        flag_design: req.body.marketHeader.flag_design,
        title: req.body.marketHeader.title,
        t_event_id: req.body.marketHeader.t_event_id,
        t_design_id: req.body.marketHeader.t_design_id,
        request_by: req.body.marketHeader.request_by,
        request_date: moment(req.body.marketHeader.request_date).format(
          "DD/MM/YYYY"
        ),
        approved_by: null,
        approved_date: null,
        assign_to: null,
        close_date: null,
        note: req.body.marketHeader.note,
        status: 1,
        reject_reason: null,
        is_delete: false,
        created_by: req.body.marketHeader.created_by,
        created_date: today
      };

      promotionData.createData(items => {
        promotionData.readAllData(promotion => {
          let theFile = req.body.file.map((content, index) => {
            return {
              t_promotion_id: newCode,
              filename: content.filename,
              size: content.size,
              extention: content.extention,
              start_date: null,
              end_date: null,
              request_due_date: moment(content.request_due_date).format(
                "DD/MM/YYYY"
              ),
              qty: parseInt(content.qty),
              todo: content.todo,
              note: content.note,
              is_delete: false,
              created_by: content.created_by,
              updated_by: null,
              created_date: moment().format("DD/MM/YYYY"),
              updated_date: null
            };
          });
          promotionItemFile.createData(data => {
            responseHelper.sendResponse(res, 200, newCode);
          }, theFile);
        });
      }, formdata);
    });
  },

  deletePromotionHandler: (req, res) => {
    let id = req.params.promotionId;
    promotionData.deleteData(items => {
      responseHelper.sendResponse(res, 200, items);
    }, id);
  },
  updatePromotionHandler: (req, res) => {
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
            if (req.body.oldFile.length === 0) {
              promotionItemFile.deleteData(lulu => {
                let theFile = req.body.file.map((content, index) => {
                  return {
                    t_promotion_id: req.body.marketHeader.code,
                    filename: content.filename,
                    size: content.size,
                    extention: content.extention,
                    start_date: null,
                    end_date: null,
                    request_due_date: moment(content.request_due_date).format(
                      "DD/MM/YYYY"
                    ),
                    qty: parseInt(content.qty),
                    todo: content.todo,
                    note: content.note,
                    is_delete: false,
                    created_by: content.created_by,
                    updated_by: null,
                    created_date: moment().format("DD/MM/YYYY"),
                    updated_date: null
                  };
                });
                // let theFile = generatorFile(
                //   req.body.file,
                //   req.body.marketHeader.code
                // );
                promotionItemFile.createData(samsul => {
                  responseHelper.sendResponse(res, 200, lili);
                }, theFile);
              }, req.body.marketHeader.code);
            } else {
              let dataForItemFile = req.body.oldFile.map((content, index) => {
                return {
                  _id: new ObjectId(content._id),
                  t_promotion_id: content.t_promotion_id,
                  filename: content.filename,
                  size: content.size,
                  extention: content.extention,
                  start_date: content.start_date,
                  end_date: content.end_date,
                  request_due_date: moment(content.request_due_date).format(
                    "DD/MM/YYYY"
                  ),
                  qty: parseInt(content.qty),
                  todo: content.todo,
                  note: content.note,
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
                    let theFile = req.body.file.map((content, index) => {
                      return {
                        t_promotion_id: req.body.marketHeader.code,
                        filename: content.filename,
                        size: content.size,
                        extention: content.extention,
                        start_date: null,
                        end_date: null,
                        request_due_date: moment(
                          content.request_due_date
                        ).format("DD/MM/YYYY"),
                        qty: parseInt(content.qty),
                        todo: content.todo,
                        note: content.note,
                        is_delete: false,
                        created_by: content.created_by,
                        updated_by: null,
                        created_date: moment().format("DD/MM/YYYY"),
                        updated_date: null
                      };
                    });
                    // let theFile = generatorFile(
                    //   req.body.file,
                    //   req.body.marketHeader.code
                    // );
                    promotionItemFile.createData(samsul => {
                      responseHelper.sendResponse(res, 200, lili);
                    }, theFile);
                  }
                }, dataForItemFile);
              }, req.body.marketHeader.code);
            }
          }, req.body.marketHeader.code);
        } else {
          promotionItem.readByPromotionID(code => {
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
                if (req.body.oldFile.length === 0) {
                  promotionItemFile.deleteData(lulu => {
                    if (req.body.file.length == 0) {
                      responseHelper.sendResponse(res, 200, lulu);
                    } else {
                      let theFile = req.body.file.map((content, index) => {
                        return {
                          t_promotion_id: req.body.marketHeader.code,
                          filename: content.filename,
                          size: content.size,
                          extention: content.extention,
                          start_date: null,
                          end_date: null,
                          request_due_date: moment(
                            content.request_due_date
                          ).format("DD/MM/YYYY"),
                          qty: parseInt(content.qty),
                          todo: content.todo,
                          note: content.note,
                          is_delete: false,
                          created_by: content.created_by,
                          updated_by: null,
                          created_date: moment().format("DD/MM/YYYY"),
                          updated_date: null
                        };
                      });
                      // let theFile = generatorFile(
                      //   req.body.file,
                      //   req.body.marketHeader.code
                      // );
                      promotionItemFile.createData(samsul => {
                        responseHelper.sendResponse(res, 200, lulu);
                      }, theFile);
                    }
                  }, req.body.marketHeader.code);
                } else {
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
                          request_due_date: moment(
                            content.request_due_date
                          ).format("DD/MM/YYYY"),
                          qty: parseInt(content.qty),
                          todo: content.todo,
                          note: content.note,
                          is_delete: false,
                          created_by: content.created_by,
                          created_date: moment(content.created_date).format(
                            "DD/MM/YYYY"
                          ),
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
                          let theFile = req.body.file.map((content, index) => {
                            return {
                              t_promotion_id: req.body.marketHeader.code,
                              filename: content.filename,
                              size: content.size,
                              extention: content.extention,
                              start_date: null,
                              end_date: null,
                              request_due_date: moment(
                                content.request_due_date
                              ).format("DD/MM/YYYY"),
                              qty: parseInt(content.qty),
                              todo: content.todo,
                              note: content.note,
                              is_delete: false,
                              created_by: content.created_by,
                              updated_by: null,
                              created_date: moment().format("DD/MM/YYYY"),
                              updated_date: null
                            };
                          });
                          // let theFile = generatorFile(
                          //   req.body.file,
                          //   req.body.marketHeader.code
                          // );
                          promotionItemFile.createData(samsul => {
                            responseHelper.sendResponse(res, 200, lili);
                          }, theFile);
                        }
                      }, dataForItemFile);
                    }, req.body.marketHeader.code);
                  }, req.body.marketHeader.code);
                }
              }, newData);
            }, req.body.marketHeader.code);
          }, req.body.marketHeader.code);
        }
      },
      data,
      promotionId
    );
  },
  handlerAddWithDesign: (req, res) => {
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
        assign_to: null,
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
          request_due_date: content.request_due_date,
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
            let itemFileUpload = req.body.file.map((content, index) => {
              return {
                t_promotion_id: newCode,
                filename: content.filename,
                size: content.size,
                extention: content.extention,
                start_date: null,
                end_date: null,
                request_due_date: moment(content.request_due_date).format(
                  "DD/MM/YYYY"
                ),
                qty: parseInt(content.qty),
                todo: content.todo,
                note: content.note,
                is_delete: false,
                created_by: content.created_by,
                updated_by: null,
                created_date: moment().format("DD/MM/YYYY"),
                updated_date: null
              };
            });
            promotionItemFile.createData(data3 => {
              responseHelper.sendResponse(res, 200, newCode);
            }, itemFileUpload);
          }
        }, dataDesignItem);
      }, dataMarketHeader);
    });
  },
  approvePromotionHandler: (req, res) => {
    data = {
      title: req.body.marketHeader.title,
      approved_by: req.body.marketHeader.approved_by,
      approved_date: moment(new Date().toDateString()).format("DD/MM/YYYY"),
      assign_to: req.body.marketHeader.assign_to,
      note: req.body.marketHeader.note,
      reject_reason: req.body.marketHeader.reject_reason,
      status: req.body.marketHeader.status
    };
    promotionData.updateData(
      item => {
        responseHelper.sendResponse(res, 200, item);
      },
      data,
      req.body.marketHeader._id
    );
  },
  closePromotionHandler: (req, res) => {
    dataMarketHeader = {
      reject_reason: req.body.marketHeader.reject_reason,
      status: req.body.marketHeader.status
    };
    dataForItem = {
      start_date: req.body.designItem
    };
    promotionData.updateData(
      item => {
        if (req.body.designItem.length === 0) {
          promotionItemFile.readByPromotionData(itemFileRead => {
            let dataItemFile = itemFileRead.map((content, index) => {
              return {
                ...content,
                start_date: req.body.oldFile[index].start_date,
                end_date: req.body.oldFile[index].start_date
              };
            });
            promotionItemFile.deleteData(itemFileDelete => {
              promotionItemFile.createData(itemFileCreate => {
                responseHelper.sendResponse(res, 200, {
                  marketHeader: item,
                  oldFile: {
                    create: itemFileCreate,
                    read: itemFileRead,
                    delete: itemFileDelete
                  }
                });
              }, dataItemFile);
            }, req.body.marketHeader.code);
          }, req.body.marketHeader.code);
        } else {
          promotionItem.readByPromotionID(itemPromotion => {
            let dataPromotionItem = itemPromotion.map((content, index) => {
              return {
                ...content,
                start_date: req.body.designItem[index].start_date,
                end_date: req.body.designItem[index].end_date
              };
            });
            promotionItem.deleteData(itemDelete => {
              promotionItem.createManyData(itemCreate => {
                if (req.body.oldFile.length === 0) {
                  responseHelper.sendResponse(res, 200, {
                    marketHeader: item,
                    designItem: {
                      create: itemCreate,
                      read: itemPromotion,
                      delete: itemDelete
                    },
                    oldFile: "None"
                  });
                } else {
                  promotionItemFile.readByPromotionData(itemFileRead => {
                    let dataItemFile = itemFileRead.map((content, index) => {
                      return {
                        ...content,
                        start_date: req.body.oldFile[index].start_date,
                        end_date: req.body.oldFile[index].start_date
                      };
                    });
                    promotionItemFile.deleteData(itemFileDelete => {
                      promotionItemFile.createData(itemFileCreate => {
                        responseHelper.sendResponse(res, 200, {
                          marketHeader: item,
                          designItem: {
                            create: itemCreate,
                            read: itemPromotion,
                            delete: itemDelete
                          },
                          oldFile: {
                            create: itemFileCreate,
                            read: itemFileRead,
                            delete: itemFileDelete
                          }
                        });
                      }, dataItemFile);
                    }, req.body.marketHeader.code);
                  }, req.body.marketHeader.code);
                }
              }, dataPromotionItem);
            }, req.body.marketHeader.code);
          }, req.body.marketHeader.code);
        }
      },
      dataMarketHeader,
      req.body.marketHeader._id
    );
  }
};
module.exports = T_Promotion_Logic;
