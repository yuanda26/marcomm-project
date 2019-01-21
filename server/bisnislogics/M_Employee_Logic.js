const responseHelper = require('../helpers/Response_Helper');
const dtl = require('../datalayers/M_Employee_Data');
const moment = require("moment");

const mEmployeeBisnislogic = {
	readAllHandler : (req, res, next) => {
		dtl.readAllHandlerData(function (items) {
			responseHelper.sendResponse(res, 200, items);
		});
	},

	readByIdHandler : (req, res, next) => {
		let param = req.params.employeeId;
		dtl.readByIdHandlerData((items) => {
			responseHelper.sendResponse(res, 200, items);
		}, param);
	},

	searchHandler : (req, res, next) => {
		let empId = req.params.empId;
		let empName = req.params.empName;
		let company = req.params.company;
		let createdDate = req.params.createdDate;
		let createdBy = req.params.createdBy;
		dtl.getUser((user) => {
			let created_by = "";
			user === null || user === undefined ? ( created_by = createdBy ) : ( created_by = user.m_employee_id )
				dtl.searchHandlerData((items) => {
					responseHelper.sendResponse(res, 200, items);
				}, empId, empName, company, createdDate, created_by);
			}, createdBy)
	},

	createHandler  : (req, res, next) => {
		let date = moment().format("YY.MM.DD") + ".";
		dtl.countEmployee(count => {
			if(count < 99 ){
				let codeEmployee = date;
				// cek dulu, baru cetak
				for (let i = 0; i < 2-(count+1).toString().length; i++) {
					codeEmployee+='0';
				}
				codeEmployee+=count+1;
				let created_date = moment().format("DD/MM/YYYY");
				let body = {
					employee_number : codeEmployee,
					first_name      : req.body.first_name,
					last_name       : req.body.last_name,
					m_company_id    : req.body.m_company_id,
					email           : req.body.email,
					is_delete       : false,
					created_by      : req.body.created_by,
					created_date    : created_date,
					updated_by      : null,
					updated_date    : null
				}	    
				dtl.createHandlerData(function(items) {
					dtl.readAllHandlerData(function (callbackReadData) {
						responseHelper.sendResponse(res, 200, callbackReadData);
					});
				}, body);
			}else{
				responseHelper.sendResponse(res, 403, "Over Capasity, Try Again Next Day Ok!");
			}
		}, date)
	},

	updateHandler : (req, res, next) => {
		let param = req.params.employeeId;
		let body = {
			employee_number : req.body.employee_number,
			first_name      : req.body.first_name,
			last_name       : req.body.last_name,
			m_company_id    : req.body.m_company_id,
			email           : req.body.email,
			is_delete       : false,
			updated_by      : req.body.updated_by,
			updated_date    : moment().format("DD/MM/YYYY")
		};
		dtl.updateHandlerData((items) => {
			dtl.readAllHandlerData(function (callbackReadData) {
				responseHelper.sendResponse(res, 200, callbackReadData);
			});
		}, param, body);
	},

	deleteHandler : (req, res, next) => {
		let param = req.params.employeeId;
		dtl.readByRelationHandlerData((userData)=>{
			if(userData.length > 0){
				responseHelper.sendResponse(res, 403, "Data Telah Berelasi");
			}else{
				dtl.deleteHandlerData((items) => {
					responseHelper.sendResponse(res, 200, items);
				}, param);
			}
		}, param)
	}
}

module.exports = mEmployeeBisnislogic;