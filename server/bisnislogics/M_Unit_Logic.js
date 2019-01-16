const responseHelper = require("../helpers/Response_Helper");
const unitData = require("../datalayers/M_Unit_Data");
const moment = require("moment");
const M_Unit_BisnisLogic = {
  readAllUnit: (req, res, next) => {
    unitData.readAllUnit(items => {
      responseHelper.sendResponse(res, 200, items);
    });
  },
  readOneByCode: (req, res, next) => {
    const code = req.params.code;

    unitData.readOneByCode(items => {
      responseHelper.sendResponse(res, 200, items);
    }, code);
  },
  createUnit: (req, res, next) => {
    let newUnit = {
      name: req.body.name,
      description: req.body.description,
      is_delete: false,
      created_by: req.body.created_by,
      created_date: moment().format("DD/MM/YYYY")
    };

    // Count All Data on Unit's Collection to Make New Unit Code
    unitData.countAll(items => {
      unitData.createUnit(
        item => {
          responseHelper.sendResponse(res, 201, item);
        },
        newUnit,
        items
      );
    });
  },
  updateUnit: (req, res, next) => {
    const code = req.params.code;
    const data = req.body;
    // Add Update Date Property
    data.updated_date = moment().format("DD/MM/YYYY");

    // Check Unit Existence
    unitData.readAllUnit(unit => {
      if (unit) {
        unitData.updateUnit(
          items => {
            responseHelper.sendResponse(res, 201, items);
          },
          data,
          code
        );
      } else {
        responseHelper.sendResponse(res, 404, "Unit Does'nt Exist");
      }
    }, code);
  },
  deleteUnit: (req, res, next) => {
    const code = req.params.code;

    // Check Unit Existence
    unitData.readOneByCode(unit => {
      if (unit) {
        unitData.deleteUnit(items => {
          responseHelper.sendResponse(res, 200, items);
        }, code);
      } else {
        responseHelper.sendResponse(res, 404, "Unit Does'nt Exist");
      }
    }, code);
  }
};

module.exports = M_Unit_BisnisLogic;
