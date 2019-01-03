const DB = require('../models/Database');
const objectId = require('mongodb').ObjectId;
const tEventModel = require('../models/T_Event_Model');
const db = DB.getConnection();

const tEventDatalayer = {
	readAllHandlerData : (callback) => {
		db.collection('t_event').aggregate([
			{
	    	$lookup : {
	        from : 'm_employee',
	        localField : "request_by",
	        foreignField : "employee_number",
	        as : 'employee'
	        
	        }
	    }, {$unwind : "$employee"},
	    { 
	    	$lookup : {
	        from : 'm_user',
	        localField : "created_by",
	        foreignField : "m_employee_id",
	        as : 'user'
	        }
	    }, {$unwind : "$user"},
	    {$match : { "is_delete" : false }},
	    {
	      $project : {
	        "_id" : "$_id",
			    "code" : "$code",
			    "event_name" : "$event_name",
			    "start_date" : "$start_date",
			    "end_date" : "$end_date",
			    "place" : "$place",
			    "budget" : "$budget",
			    "request_by" : "$request_by" ,
			    "request_by_first_name" : "$employee.first_name",
			    "request_by_last_name" : "$employee.last_name",
			    "request_date" : "$request_date",
			    "approved_by" : "$approved_by",
			    "approved_date" : "$approved_date",
			    "assign_to" : "$assign_to",
			    "closed_date" : "$closed_date",
			    "note" : "$note",
			    "status" : "$status",
			    "reject_reason" : "$reject_reason",
			    "is_delete" : "$is_delete",
			    "created_by" : "$user.username",
			    "created_date" : "$created_date",
			    "updated_by" : "$updated_by",
			    "updated_date" : "$updated_date"
				}
	    }
		]).toArray((err, docs) => {
			let mTEventData = docs.map((row) => {
				if(row.status === "1"){
					row.status = "Submitted"
				}else if(row.status === "2"){
					row.status = "In Progress"
				}else if(row.status === "3"){
					row.status = "Done"
				}else if(row.status === "0"){
					row.status = "Rejected"
				}
				return new tEventModel(row)
			})
			callback(mTEventData)
		})
	},

	readByIdHandlerData : (callback, param) => {
		db.collection('t_event').find({_id : new objectId(param)}, {"is_delete" : false}).toArray((err, docs) => {
			let mTEventData = docs.map((row) => {
				return new tEventModel(row)
			})
			callback(mTEventData)
		})
	},

	getUser : (callback, param) => {
		param === "" ? ( param = "wefd34w57@4346^8" ) : ( param = param  )
		db.collection('m_user').findOne({ username : new RegExp(param), is_delete : false }, (err, docs) => {
			if(err){
				callback("")
			}else{
				callback(docs)
			}
		})
	},

	getEmployee : (callback, param) => {
		param === "" ? ( param = "vT%67V0iiuvwe5" ) : ( param = param )
		let newName = param.split(" ")
		let first_name = ""
		let last_name = ""
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
		db.collection('m_employee').findOne({ 
			first_name : new RegExp(first_name), 
			last_name : new RegExp(last_name) 
			}, (err, docs) => {
				if(err){
					callback("")
				}else{
					callback(docs)
				}
		})
	},

	// code, request_by, request_date, status, created_date, created_by
	searchHandlerData : (callback, code, request_by, request_date, status, created_date, created_by) => {
		let newStatus = ""
		if( ("Submitted" || "SUBMITTED" || "submitted") === status ){
			newStatus = "1"
		}else if( ("In Progress" || "in progress" || "IN PROGRESS") === status ){
			newStatus = "2"
		}else if( ("Done" || "done" || "DONE") === status ){
			newStatus = "3"
		}else if( ("Rejected" || "rejected" || "REJECTED") === status ){
			newStatus = "0"
		}
		db.collection('t_event').aggregate([
			{
	    	$lookup : {
	        from : 'm_employee',
	        localField : "request_by",
	        foreignField : "employee_number",
	        as : 'employee'
	        
	        }
	    }, {$unwind : "$employee"},
	    { 
	    	$lookup : {
	        from : 'm_user',
	        localField : "created_by",
	        foreignField : "m_employee_id",
	        as : 'user'
	        }
	    }, {$unwind : "$user"},
			{ $match : {
					code : new RegExp(code),
					request_by : new RegExp(request_by), 
					request_date : new RegExp(request_date),
					status : new RegExp(newStatus), 
					created_date : new RegExp(created_date),
					created_by : new RegExp(created_by), 
					is_delete : false
				}
			},
			 {
	      $project : {
	        "_id" : "$_id",
			    "code" : "$code",
			    "event_name" : "$event_name",
			    "start_date" : "$start_date",
			    "end_date" : "$end_date",
			    "place" : "$place",
			    "budget" : "$budget",
			    "request_by" : "$request_by" ,
			    "request_by_first_name" : "$employee.first_name",
			    "request_by_last_name" : "$employee.last_name",
			    "request_date" : "$request_date",
			    "approved_by" : "$approved_by",
			    "approved_date" : "$approved_date",
			    "assign_to" : "$assign_to",
			    "closed_date" : "$closed_date",
			    "note" : "$note",
			    "status" : "$status",
			    "reject_reason" : "$reject_reason",
			    "is_delete" : "$is_delete",
			    "created_by" : "$user.username",
			    "created_date" : "$created_date",
			    "updated_by" : "$updated_by",
			    "updated_date" : "$updated_date"
				}
	    }
	    ]).toArray((err, docs) => {
			let mEvent = docs.map((row) => {
				if(row.status === "1"){
					row.status = "Submitted"
				}else if(row.status === "2"){
					row.status = "In Progress"
				}else if(row.status === "3"){
					row.status = "Done"
				}else if(row.status === "0"){
					row.status = "Rejected"
				}
				return new tEventModel(row)
			})
			callback(mEvent)
		})
	},

	countTEvent : (callback, newDate)=>{
		db.collection('t_event').find(
			{ code : { $regex : new RegExp(newDate) } } ).count(
			(err, count)=>{
				callback(count)
			}
		);
	},
	
	createHandlerData : (callback, body) => {
		let newBody = {
			_id           : body._id,
			code          : body.code,
			event_name    : body.event_name,
			start_date    : body.start_date,
			end_date      : body.end_date,
			place         : body.place,
			budget        : body.budget,
			request_by    : body.request_by,
			request_date  : body.request_date,
			approved_by   : body.approved_by,
			approved_date : body.approved_date,
			assign_to     : body.assign_to,
			closed_date   : body.closed_date,
			note          : body.note,
			status        : "1",
			reject_reason : body.reject_reason,
			is_delete     : false,
			created_by    : body.created_by,
			created_date  : body.created_date,
			updated_by    : body.updated_by,
			updated_date  : body.updated_date
		}
		db.collection('t_event').insertOne(newBody, (err, docs) => {
			callback(newBody)
		})
	},

	updateHandlerData : (callback, param, body) => {
		db.collection('t_event').updateOne({_id : objectId(param)}, {$set : body}, (err, docs) => {
				callback(docs)
		})
	},

	deleteHandlerData : (callback, param) => {
		db.collection('t_event').updateOne({_id : objectId(param)}, { $set : {is_delete : true}}, (err, docs) => {
				callback(docs)
		})
	}
}

module.exports = tEventDatalayer;