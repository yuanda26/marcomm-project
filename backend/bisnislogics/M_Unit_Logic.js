const responseHelper = require("../helpers/Response_Helper");
const unitData = require("../datalayers/M_Unit_Data");
const moment = require("moment");
const M_Unit_BisnisLogic = {
  readAllUnit: (req, res, next) => {
    unitData.readAllUnit(items => {
      responseHelper.sendResponse(res, 200, items);
    });
  },
  readOneById: (req, res, next) => {
    const unitId = req.params.unitId;

    unitData.readOneById(items => {
      responseHelper.sendResponse(res, 200, items);
    }, unitId);
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
    const unitId = req.params.unitId;
    const data = req.body;
    // Add Update Date Property
    data.updated_date = moment().format("DD/MM/YYYY");

    // Check Unit Existence
    unitData.readOneById(unit => {
      if (unit) {
        unitData.updateUnit(
          items => {
            responseHelper.sendResponse(res, 201, items);
          },
          data,
          unitId
        );
      } else {
        responseHelper.sendResponse(res, 404, "Unit Does'nt Exist");
      }
    }, unitId);
  },
  deleteUnit: (req, res, next) => {
    const unitId = req.params.unitId;

    // Check Unit Existence
    unitData.readOneById(unit => {
      if (unit) {
        unitData.deleteUnit(items => {
          responseHelper.sendResponse(res, 200, items);
        }, unitId);
      } else {
        responseHelper.sendResponse(res, 404, "Unit Does'nt Exist");
      }
    }, unitId);
  }
};

module.exports = M_Unit_BisnisLogic;
