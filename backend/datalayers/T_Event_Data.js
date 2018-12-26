const DB = require('../models/Database');
const objectId = require('mongodb').ObjectId;
const tEventModel = require('../models/T_Event_Model');
const tEventModel1 = require('../models/T_Event_Model_1');
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
			    "created_by" : "$created_by",
			    "created_date" : "$created_date",
			    "updated_by" : "$updated_by",
			    "updated_date" : "$updated_date"
				}
	    }
		]).toArray((err, docs) => {
			let mTEventData = docs.map((row) => {
				if(row.status == 1){
					row.status = "Submitted"
				}else if(row.status == 2){
					row.status = "In Progress"
				}else if(row.status == 3){
					row.status = "Done"
				}else if(row.status == 0){
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

	countTEvent : (callback, newDate)=>{
		db.collection('t_event').find(
			{ code : { $regex : new RegExp(newDate) } } ).count(
			(err, count)=>{
				callback(count)
			}
		);
	},
	
	createHandlerData : (callback, body) => {
		let newBody = new tEventModel1(body)
		newBody.is_delete = false;
		newBody.status = 1;
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