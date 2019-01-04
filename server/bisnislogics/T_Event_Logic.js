const responseHelper = require('../helpers/Response_Helper');
const dtl = require('../datalayers/T_Event_Data');
const moment = require("moment");

const tEventBisnislogic = {
	readAllHandler : (req, res, next) => {
		dtl.readAllHandlerData(function (items) {
			responseHelper.sendResponse(res, 200, items);
		});
	},

	readByIdHandler : (req, res, next) => {
		let param = req.params.eventId;
		dtl.readByIdHandlerData((items) => {
			responseHelper.sendResponse(res, 200, items);
		}, param);
	},

	searchHandler : (req, res, next) => {
		let code = req.params.code;
		let status = req.params.status;
		let request_date = "";
		let created_date = "";
		let paramUser = req.params.created_by;
		let paramEmployee = req.params.request_by;

		if( req.params.request_date !== "" ){
			request_date = moment(req.params.request_date).format("DD/MM/YYYY");
		}
		if( req.params.created_date !== "" ){
			created_date = moment(req.params.created_date).format("DD/MM/YYYY");
		}
		dtl.getUser((user) => {
			let created_by = "";
			user === null ? ( created_by = "" ) : ( created_by = user.m_employee_id )
				dtl.getEmployee((employee)=>{
					let request_by = "";
					employee === null ? ( request_by = "" ) : ( request_by = employee.employee_number )
					dtl.searchHandlerData((items) => {
						responseHelper.sendResponse(res, 200, items);
					}, code, request_by, request_date, status, created_date, created_by);
				}, paramEmployee)
			}, paramUser)
	},

	createHandler  : (req, res, next) => {
		let date = moment().format("DDMMYY");
		dtl.countTEvent(count => {
			let codeTEvent = "TRWOEV" + date;
			for (let i = 0; i < 5-(count+1).toString().length; i++) {
				codeTEvent+='0';
			}
			codeTEvent+=count+1;

			let body = req.body;
			body.code = codeTEvent;
			body.created_date = moment().format("DD/MM/YYYY")
			dtl.createHandlerData(function(items, date) {
				dtl.readAllHandlerData(function (callbackReadData) {
					responseHelper.sendResponse(res, 200, callbackReadData);
				});
			}, body);
		}, date)
	},

	updateHandler : (req, res, next) => {
		let date = moment().format("DD/MM/YYYY");
		let param = req.params.eventId;
		let body = {
			code          : req.body.code,
			event_name    : req.body.event_name,
			start_date    : req.body.start_date,
			end_date      : req.body.end_date,
			place         : req.body.place,
			budget        : req.body.budget,
			request_by    : req.body.request_by,
			request_date  : req.body.request_date,
			approved_by   : req.body.approved_by,
			approved_date : req.body.approved_date,
			assign_to     : req.body.assign_to,
			closed_date   : req.body.closed_date,
			note          : req.body.note,
			status        : "1",
			reject_reason : req.body.reject_reason,
			is_delete     : false,
			created_by    : req.body.created_by,
			created_date  : req.body.created_date,
			updated_by    : req.body.updated_by,
			updated_date  : date,
		}
		dtl.updateHandlerData((items) => {
			dtl.readAllHandlerData(function (callbackReadData) {
				responseHelper.sendResponse(res, 200, callbackReadData);
			});
		}, param, body);
	},

	deleteHandler : (req, res, next) => {
		let param = req.params.eventId;
		dtl.deleteHandlerData((items) => {
			responseHelper.sendResponse(res, 200, items);
		}, param);

	}

}

module.exports = tEventBisnislogic;