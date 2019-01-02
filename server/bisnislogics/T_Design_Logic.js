const responseHelper = require("../helpers/Response_Helper");
const designData = require("../datalayers/T_Design_Data");
const moment = require("moment");

const T_Design_Logic = {
  readAllDesignHandler: (req, res, next) => {
    designData.readAllData(design => {
      responseHelper.sendResponse(res, 200, design);
    });
  },
  readByCodeHandler: (req, res, next) => {
    const code = req.params.code;

    designData.readByCodeData(design => {
      if (design) {
        responseHelper.sendResponse(res, 200, design);
      } else {
        responseHelper.sendResponse(
          res,
          404,
          "404. Transaction Design Data Not Found"
        );
      }
    }, code);
  },
  getCodeHandler: (req, res, next) => {
    designData.lastCodeData(design => {
      if (design.length > 0) {
        let pattern = design[0].code.substr(-5);
        let latestCode = parseInt(pattern) + 1;
        let generatedPattern = pattern.substr(
          0,
          pattern.length - latestCode.toString().length
        );

        // return new code
        responseHelper.sendResponse(
          res,
          200,
          `TRWODS${moment().format("DDMMYYYY")}${generatedPattern}${latestCode}`
        );
      } else {
        responseHelper.sendResponse(
          res,
          200,
          `TRWODS${moment().format("DDMMYYYY")}00001`
        );
      }
    });
  },
  createDesignHandler: (req, res, next) => {
    const today = moment().format("DD/MM/YYYY");

    let formdata = {
      code: req.body.code,
      t_event_id: req.body.t_event_id,
      title_header: req.body.title_header,
      note: req.body.note,
      request_by: req.body.request_by,
      request_date: today,
      created_by: req.body.created_by,
      created_date: today,
      status: 1,
      is_delete: false
    };

    designData.createData(items => {
      responseHelper.sendResponse(res, 200, items);
    }, formdata);
  },
  updateDesignHandler: (req, res, next) => {
    const code = req.params.code;

    designData.readByCodeData(design => {
      if (design) {
        if (design.status === 1) {
          const t_event_id =
            req.body.t_event_id === ""
              ? design.t_event_id
              : req.body.t_event_id;
          const title_header =
            req.body.title_header === ""
              ? design.title_header
              : req.body.title_header;
          const note = req.body.note === "" ? design.note : req.body.note;

          // contain formdata to an object
          const formdata = {
            t_event_id,
            title_header,
            note,
            updated_by: req.body.updated_by,
            updated_date: moment().format("DD/MM/YYYY")
          };

          designData.updateData(
            design => {
              responseHelper.sendResponse(res, 200, design);
            },
            code,
            formdata
          );
        } else {
          responseHelper.sendResponse(
            res,
            401,
            "We Are Sorry. Transaction Design Cannot be Changed."
          );
        }
      } else {
        responseHelper.sendResponse(
          res,
          404,
          "404. Transaction Design Data Not Found"
        );
      }
    }, code);
  },
  approveHandler: (req, res, next) => {
    const code = req.params.code;
    const data = { status: 2, assign_to: req.body.assign_to };

    designData.approveStatus(
      items => {
        responseHelper.sendResponse(res, 200, items);
      },
      data,
      code
    );
  },
  closeReqHandler: (req, res, next) => {
    const code = req.params.code;

    designData.closeRequestData(
      items => {
        responseHelper.sendResponse(res, 200, items);
      },
      { status: 3 },
      code
    );
  },
  createDesignItemFile: (req, res, next) => {
    let data = req.body.data;

    designData.uploadItemFiles(items => {
      responseHelper.sendResponse(res, 200, items);
    }, data);
  },
  getDesignFiles: (req, res, next) => {
    const itemId = req.params.itemId;

    designData.readFilesById(design => {
      if (design) {
        responseHelper.sendResponse(res, 200, design);
      } else {
        responseHelper.sendResponse(
          res,
          404,
          "404. Transaction Design Files Not Found"
        );
      }
    }, itemId);
  },
  getRequester: (req, res, next) => {
    designData.getRequesterData(items => {
      responseHelper.sendResponse(res, 200, items);
    });
  },
  getStaff: (req, res, next) => {
    designData.getStaffData(items => {
      responseHelper.sendResponse(res, 200, items);
    });
  }
};
module.exports = T_Design_Logic;
