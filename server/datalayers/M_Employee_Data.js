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
			},
			{ 
				$lookup : {
					from : "m_user",
					localField : "created_by",
					foreignField : "m_employee_id",
					as : "user"
				}
			},
			{ 
				$lookup : {
					from : "m_user",
					localField : "employee_number",
					foreignField : "m_employee_id",
					as : "role"
				}
			},{$unwind : {
        path:"$role",
        preserveNullAndEmptyArrays:true
        }},
			 { $match : {is_delete : false}},
			 { $sort : { employee_number : -1 } },
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
					"created_by"      : "$user.username",
					"created_date"    : "$created_date",
					"updated_by"      : "$updated_by",
					"updated_date"    : "$updated_date",
					"role"            : "$role.m_role_id"
			  }                                   
		  }]).toArray((err, docs) => {
			if ( err ) {
				callback(err)
			} else {
				let mEmployee = docs.map((row) => {
					return new employeeModel(row)
				})
				callback(mEmployee)
			}
		})
	},

	readByIdHandlerData : (callback, param) => {
		db.collection('m_employee').find({employee_number : param}, {"is_delete" : false}).toArray((err, docs) => {
			if (err) {
				callback(err)
			} else {
				let mEmployee = docs.map((row) => {
					return new employeeModel(row)
				})
				callback(mEmployee)
			}
		})
	},

	getUser : (callback, param) => {
		if(param === "") {
			callback(param)			
		}else{
			db.collection('m_user').findOne({ username : new RegExp(param), is_delete : false }, (err, docs) => {
				if(err){
					callback("")
				}else{
					callback(docs)
				}
			})
		}
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
		if(createdDate !== ""){
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
			{ 
				$lookup : {
					from : "m_user",
					localField : "created_by",
					foreignField : "m_employee_id",
					as : "user"
				}
			},
			{ $match : {
					employee_number : new RegExp(empId),
					first_name : new RegExp(first_name), 
					last_name : new RegExp(last_name),
					m_company_id : new RegExp(company), 
					created_date : new RegExp(newCreatedDate),
					created_by : new RegExp(createdBy), 
					is_delete : false
				}
			},{$sort : { employee_number : -1 }},
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
					"created_by"      : "$user.username",
					"created_date"    : "$created_date",
					"updated_by"      : "$updated_by",
					"updated_date"    : "$updated_date"
			  }
		                                       
		  }]).toArray((err, docs) => {
			if (err) {
				callback(err)
			} else {
				let mEmployee = docs.map((row) => {
					return new employeeModel(row)
				})
				callback(mEmployee)
			}
		})
	},

	countEmployee : (callback, newDate)=>{
		db.collection('m_employee').find(
			{ employee_number : { $regex : new RegExp(newDate) } } ).count(
			(err, count)=>{
				if (err) {
					callback(err)
				} else {
				callback(count)
				}
			});
	},
	
	createHandlerData : (callback, body) => {
		db.collection('m_employee').insertOne(body, (err, docs) => {
			if (err) {
				callback(err)
			} else {
				callback(body)
			}
		})
	},

	updateHandlerData : (callback, param, body) => {
		db.collection('m_employee').updateOne({_id : objectId(param)}, {$set : body}, (err, docs) => {
			if (err) {
				callback(err)
			} else {
				callback(docs)
			}
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
				if (err) {
					callback(err)
				} else {
				callback(docs)
				}
		})
	},

	deleteHandlerData : (callback, param) => {
		db.collection('m_employee').updateOne({_id : objectId(param)}, { $set : {is_delete : true}}, (err, docs) => {
			if (err) {
				callback(err)
			} else {
				callback(docs)
			}
		})
	}
}

module.exports = employeeDatalayer;