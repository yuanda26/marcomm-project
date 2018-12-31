const DB = require('../models/Database');
const objectId = require('mongodb').ObjectId;
const employeeModel = require('../models/M_Employee_Model');
const db = DB.getConnection();
const moment = require('moment')

const employeeDatalayer = {
	readAllHandlerData : (callback) => {
		db.collection('m_employee').aggregate([
			{ 
				$lookup : {
					from : "m_company",
					localField : "m_company_id",
					foreignField : "code",
					as : "compa"
				}
			}, {$unwind : "$compa"}, { $match : {is_delete : false}},
		  {
			  $project : {
			    "_id"             : "$_id",
					"employee_number" : "$employee_number",
					"first_name"      : "$first_name",
					"last_name"       : "$last_name",
					"m_company_id"    : "$m_company_id",
					"m_company_name"  : "$compa.name",
					"email"           : "$email",
					"is_delete"       : "$is_delete",
					"created_by"      : "$created_by",
					"created_date"    : "$created_date",
					"updated_by"      : "$updated_by",
					"updated_date"    : "$updated_date"
			  }
		                                       
		  }]).toArray((err, docs) => {
			let mEmployee = docs.map((row) => {
				return new employeeModel(row)
			})
			callback(mEmployee)
		})
	},

	readByIdHandlerData : (callback, param) => {
		db.collection('m_employee').find({employee_number : param}, {"is_delete" : false}).toArray((err, docs) => {
			let mEmployee = docs.map((row) => {
				return new employeeModel(row)
			})
			callback(mEmployee)
		})
	},

	searchHandlerData : (callback, empId, empName, company, createdDate, createdBy) => {
		let newName = empName.split(" ")
		let first_name = ""
		let last_name = ""
		let newCreatedDate = ""
		newName.map((row, index)=>{
			if(index == 0){
				first_name = row
			}else{
				last_name += row
				if(newName.length > 1 && index < newName.length-1){
					last_name += " "
				}
			}
		})
		if(createdDate != ""){
			newCreatedDate = moment(createdDate).format("DD/MM/YYYY")
		}else{
			newCreatedDate = ""
		}
		db.collection('m_employee').aggregate([
			{ 
				$lookup : {
					from : "m_company",
					localField : "m_company_id",
					foreignField : "code",
					as : "compa"
				}
			}, {$unwind : "$compa"},
			{ $match : {
					employee_number : new RegExp(empId),
					first_name : new RegExp(first_name), 
					last_name : new RegExp(last_name),
					m_company_id : new RegExp(company), 
					created_date : new RegExp(newCreatedDate),
					created_by : new RegExp(createdBy), 
					is_delete : false
				}
			},
		  {
			  $project : {
			    "_id"             : "$_id",
					"employee_number" : "$employee_number",
					"first_name"      : "$first_name",
					"last_name"       : "$last_name",
					"m_company_id"    : "$m_company_id",
					"m_company_name"  : "$compa.name",
					"email"           : "$email",
					"is_delete"       : "$is_delete",
					"created_by"      : "$created_by",
					"created_date"    : "$created_date",
					"updated_by"      : "$updated_by",
					"updated_date"    : "$updated_date"
			  }
		                                       
		  }]).toArray((err, docs) => {
			let mEmployee = docs.map((row) => {
				return new employeeModel(row)
			})
			callback(mEmployee)
		})
	},

	countEmployee : (callback, newDate)=>{
		db.collection('m_employee').find(
			{ employee_number : { $regex : new RegExp(newDate) } } ).count(
			(err, count)=>{
				callback(count)
			}
		);
	},
	
	createHandlerData : (callback, body) => {
		db.collection('m_employee').insertOne(body, (err, docs) => {
			callback(body)
		})

	},

	updateHandlerData : (callback, param, body) => {
		db.collection('m_employee').updateOne({_id : objectId(param)}, {$set : body}, (err, docs) => {
				callback(docs)
		})
	},

	readByRelationHandlerData : (callback, param) => {
		db.collection('m_employee').aggregate([
			{ 
				$lookup : {
					from : "m_user",
					localField : "employee_number",
					foreignField : "m_employee_id",
					as : "user"
				}
			},{$unwind : "$user"},
			{$match : { "_id" : objectId(param) }}
			]).toArray((err, docs) => {
			callback(docs)
		})
	},

	deleteHandlerData : (callback, param) => {
		db.collection('m_employee').updateOne({_id : objectId(param)}, { $set : {is_delete : true}}, (err, docs) => {
				callback(docs)
		})
	}
}

module.exports = employeeDatalayer;