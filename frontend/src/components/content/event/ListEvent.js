import React from 'react'
import moment from 'moment'
import PropTypes from "prop-types"
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Alert } from 'reactstrap'
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { getEvent } from "../../../actions/event/get_all_act";
import { getEmployeeId } from "../../../actions/employee/get_id_act";

import API from '../../../helpers/API'
import apiconfig from '../../../config/apiconfig'

import EditEvent from './EditEvent'
import CreateEvent from './CreateEvent'
import ViewEvent from './ViewEvent'

import { Search, DeleteOutlined, CreateOutlined } from "@material-ui/icons";

class ListEvent extends React.Component {
	constructor(props){
		super(props)
		this.state={
			initialSearch:{
				code : /(?:)/,
				request_by : /(?:)/,
				request_date : /(?:)/,
				status : /(?:)/,
				created_date : /(?:)/,
				created_by: /(?:)/
			},
			created_date: null,
			request_date:null,
			hasil: [],
			showCreateEvent:false,
			event:[],
			currentEvent:{},
			currentEmployee:{},
			alertData: {
				status: 0,
        message: "",
        action:"",
        optional:"",
        code: ""
			},
      createdDate : null
		}
	}

	viewModalHandler = (eventid) => {
		let tmp = {};
		this.state.event.map(ele => {
			if (eventid == ele._id) {
				tmp = ele;
			}
		});
		this.setState({
			currentEvent: tmp,
			viewEvent: true
		});
	}

	editModalHandler = (eventid) => {
		let tmp = {};
		this.state.event.map(ele => {
			if (eventid == ele._id) {
				tmp = ele
				this.setState({
					currentEvent: tmp,
					editEvent: true
				});
			}
		});
	}

	handleChangeCreatedDate = date => {
		let { initialSearch } = this.state
		if(date){
	    let newDate = moment(date).format("DD/MM/YYYY")
	    initialSearch["created_date"] = new RegExp(newDate)
    }else{
    	initialSearch["created_date"] = /(?:)/
    }
    this.setState({
  		initialSearch: initialSearch,
      created_date: date
    });
    this.SearchHandler()
	}

	handleChangeRequestDate = date => {
		let { initialSearch } = this.state
		if(date){
	    let newDate = moment(date).format("DD/MM/YYYY")
	    initialSearch["request_date"] = new RegExp(newDate)
    }else{
    	initialSearch["request_date"] = /(?:)/
    }
    this.setState({
  		initialSearch : initialSearch,
      request_date : date
    });
    this.SearchHandler()
	}

	changeHandler = (event) => {
		let { value, name } = event.target;
		let { initialSearch } = this.state
		initialSearch[name] = new RegExp(value.toLowerCase())
    this.setState({
      initialSearch : initialSearch
    });
    this.SearchHandler()
	}

	SearchHandler = () => {
		const {
			code, request_by, request_date, 
			status, created_date,
			created_by
		} = this.state.initialSearch
		let test = [];
		this.state.event.map(ele => {
			let fullName = ele.request_by_first_name + " " + ele.request_by_last_name
			if(
				( code.test(ele.code.toLowerCase()) ||
								code.test("") )
				&&
				( request_by.test(fullName.toLowerCase()) ||
								request_by.test("") )
				&&
				( request_date.test(ele.request_date) ||
								request_date.test("") )
				&&
				( status.test(ele.status.toLowerCase()) ||
								status.test("") )
				&&
				( created_date.test(ele.created_date) ||
								created_date.test("") )
				&&
				( created_by.test(ele.created_by.toLowerCase()) ||
				 				created_by.test("") ) 
			){
				test.push(ele);
			}
		});
		this.setState({
			hasil: test,
		});
	}

	closeModalHandler = () => {
		this.setState({
			viewEvent: false,
			editEvent: false,
			deleteEvent: false
		});
	}

	showHandler = () => {
		this.setState({ showCreateEvent: true});
	}

	closeHandler = () => {
		this.setState({ showCreateEvent: false });
	}

	componentDidMount = () => {
		let userdata = JSON.parse(localStorage.getItem(apiconfig.LS.USERDATA))
		this.props.getEvent();
		this.props.getEmployeeId(userdata.m_employee_id);
	}

	componentWillReceiveProps(newProp){
		this.setState({
			hasil : newProp.event.myEvent,
			event : newProp.event.myEvent,
			currentEmployee : newProp.employee.myEmployeeId.first_name + " " + newProp.employee.myEmployeeId.last_name,
		})
		
	}

	modalStatus = (status, action, message, optional, code) => {
    this.setState({
      alertData: {
        status: status,
        message: message,
        action: action,
        optional:optional,
        code: code
      },
      viewEvent: false,
      editEvent: false,
      deleteEvent: false
    });
  }

	render() {
		return (
			<div className="card border-primary">
				<div className="card-header bg-primary text-white"><h4>List Event</h4></div>
				<div className="card-body">
					<div className="col">
						<nav aria-label="breadcrumb">
							<ul className="breadcrumb">
								<li className="breadcrumb-item"><a href="" >Home</a></li>
								<li className="breadcrumb-item"><a href="#">Transaction</a></li>
								<li className="breadcrumb-item active" aria-current="page">List Event</li>
							</ul>
						</nav>
					</div>
					<div>
						{this.state.alertData.status == 1 ? (
              <Alert color="success">
                <b>Data {this.state.alertData.action} !</b>
                	{" " + this.state.alertData.message + " "} 
                <strong>{this.state.alertData.code}</strong>
                	{this.state.alertData.optional}
              </Alert>
            ) : ("")
						}
						{this.state.alertData.status == 2 ? (
              <Alert color="danger">
                <b>Data {this.state.alertData.action} !</b>
                	{" " + this.state.alertData.message + " "} 
                <strong>{this.state.alertData.code}</strong>
                	{this.state.alertData.optional}
              </Alert>
            ) : ("")
						}
					<CreateEvent
						event={this.state.event}
						currentEmployee={this.state.currentEmployee}
						create={this.state.showCreateEvent}
						closeHandler={this.closeHandler}
						modalStatus={this.modalStatus}
					/>
					<ViewEvent
						view={this.state.viewEvent}
						closeModalHandler={this.closeModalHandler}
						currentEvent={this.state.currentEvent}
					/>
					<EditEvent
						event={this.state.event}
						edit={this.state.editEvent}
						closeModalHandler={this.closeModalHandler}
						currentEvent={this.state.currentEvent}
						modalStatus={this.modalStatus}
					/>
						<button 
							type="button" 
							className="btn btn-primary float-right"
							onClick ={this.showHandler}
						>
							Add
						</button>
						<br/> <br/>
						<form>
							<div className="form-row align-items-center">
								<div className='col-md-3'>
									<input 
										placeholder="Transaction Code" 
										className="form-control" 
										name="code"
										onChange={this.changeHandler}
									/>
								</div>
								<div className='col-md'>
									<input 
										placeholder="Request By" 
										className="form-control" 
										name="request_by"
										onChange={this.changeHandler}
									/>
								</div>
								<div className='col-md'>
									<DatePicker
		                className="form-control"
		                placeholderText="Request Date" 
		                name="request_date"
		                selected={this.state.request_date}
		                onChange={this.handleChangeRequestDate}
		              />
								</div>
								<div className='col-md'>
									<input 
										placeholder="Status" 
										className="form-control" 
										name="status"
										onChange={this.changeHandler}
									/>
								</div>
								<div className='col-md'>
									<DatePicker
		                className="form-control"
		                placeholderText="Created" 
		                name="created_date"
		                selected={this.state.created_date}
		                onChange={this.handleChangeCreatedDate}
		              />
								</div>
								<div className='col-md'>
									<input 
										placeholder="Created By" 
										name="created_by"
										className="form-control" 
										onChange={this.changeHandler}
									/>
								</div>
								<div className='col-md'>
									<button 
										type="button" 
										className="btn btn-warning float-right"
										onClick ={this.SearchHandler}
									>Search
									</button>
								</div>
							</div>
						</form>
						<table id="mytable" className="table table table-hover">
							<thead>
								<tr>
									<th>No.</th>
									<th>Transaction Code</th>
									<th>Request By</th>
									<th>Request Date</th>
									<th>Status</th>
									<th>Created Date</th>
									<th>Created By</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{this.state.hasil.map((row,x)=>
								<tr>
									<td>{x + 1}</td>
									<td>{row.code}</td>
									<td>{row.request_by_first_name + " " 
										+ row.request_by_last_name }</td>
									<td>{row.request_date}</td>
									<td>{row.status}</td>
									<td>{row.created_date}</td>
									<td>{row.created_by}</td>
									<td>
										{/*<Link to='#'>
											<span 
												onClick = {() => {
													this.viewModalHandler(row._id)}
												} 
												className="fa fa-search" 
												style={
													{fontSize : '18px', paddingRight : '30px'}
												}
											/>
											<span 
												onClick = {() => {
													this.editModalHandler(row._id)}
												}	 
												className="fa fa-edit" 
												style={
													{fontSize : '18px', paddingRight : '30px'}
												} 
											/>
										</Link>*/}
										<Link to="#">
                      <Search
                      onClick={() => {
                      this.viewModalHandler(row._id);
                      }}
                      />
	                  </Link>
	                  <Link to="#">
                      <CreateOutlined
                      onClick={() => {
                      this.editModalHandler(row._id);
                      }}
                      />
	                  </Link>
									</td>
								</tr>
								)}
							 </tbody>
			      </table>
					</div>
				</div>
			</div>
		)
	}
}

ListEvent.propTypes = {
  getEvent: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  getEmployeeId: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  event: state.event,
  employee: state.employee
});

export default connect(
	mapStateToProps,{ getEvent, getEmployeeId }
	)( ListEvent );