import React from 'react'
import moment from 'moment'
import PropTypes from "prop-types"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Alert } from 'reactstrap'
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { getAllEvent, searchEvent, eraseStatus } from "../../../actions/eventAction";

import EditEvent from './EditEvent'
import CreateEvent from './CreateEvent'
import ViewEvent from './ViewEvent'

import { Search, CreateOutlined } from "@material-ui/icons";

class ListEvent extends React.Component {
	constructor(props){
		super(props)
		this.state={
			initialSearch:{
				code : "",
				request_by : "",
				request_date : "",
				status : "",
				created_date : "",
				created_by: ""
			},
			created_date: null,
			request_date:null,
			showCreateEvent:false,
			currentEvent:{},
			alertData: {
				status: 0,
        message: "bebas"
			},
      createdDate : null,
      status: [
      	{ _id: "4sv8e%7qjhd6", name: "Submitted", code: 1},
      	{ _id: "tgsr62%fdsd1", name: "In Progress", code: 2},
      	{ _id: "byw235%3bhty", name: "Done", code: 3},
      	{ _id: "sdf64%fgre3#", name: "Rejected", code: 0},
      ]
		}
	}

	viewModalHandler = (eventid) => {
		let tmp = {};
		this.props.event.myEvent.forEach(ele => {
			if (eventid === ele._id) {
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
		this.props.event.myEvent.forEach(ele => {
			if (eventid === ele._id) {
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
	    initialSearch["created_date"] = moment(date).format("YYYY-MM-DD")
    }else{
    	initialSearch["created_date"] = ""
    }
    this.setState({
  		initialSearch: initialSearch,
      created_date: date
    });
	}

	handleChangeRequestDate = date => {
		let { initialSearch } = this.state
		if(date){
	    initialSearch["request_date"] = moment(date).format("YYYY-MM-DD")
    }else{
    	initialSearch["request_date"] = ""
    }
    this.setState({
  		initialSearch : initialSearch,
      request_date : date
    });
	}

	changeHandler = (event) => {
		let { value, name } = event.target;
		let { initialSearch } = this.state
		initialSearch[name] = value
    this.setState({
      initialSearch : initialSearch
    });
	}

	SearchHandler = () => {
		let {
			code,request_by,request_date,status,created_date,created_by
		} = this.state.initialSearch
		this.props.searchEvent(
			code, request_by, request_date, status, created_date, created_by
		)
	}

	closeModalHandler = () => {
		this.setState({
			viewEvent: false,
			editEvent: false,
			deleteEvent: false,
		});
	}

	showHandler = () => {
		this.setState({ showCreateEvent: true});
	}

	closeHandler = () => {
		this.setState({ showCreateEvent: false});
	}

	componentDidMount = () => {
		this.props.getAllEvent();
	}

	modalStatus = (status, message) => {
		this.props.eraseStatus()
    this.setState({
      alertData: {
        status: status,
        message: message
      }
    });
    setTimeout(()=>{
    	this.setState({
      alertData: {
        status: 0,
        message: ""
      }
    });
    }, 3000)
  }

  closeAlert=()=>{
  	this.setState({
      alertData: {
        status: 0,
        message: ""
      }
    });
  }

  componentDidUpdate(prevProps) {
	  // Typical usage (don't forget to compare props):
	  if (this.props.statusCreate !== prevProps.statusCreate) {
	    this.props.eraseStatus()
	  }
	}

	render() {
		return (
			<div className="container">
        <div className="row">
          <div className="col-md-12">
						<div className="card border-primary">
							<div className="card-header bg-primary text-white"><h4>List Event</h4></div>
							<div className="card-body">
								<div className="col">
									<nav aria-label="breadcrumb">
										<ul className="breadcrumb">
											<li className="breadcrumb-item"><a href="/dashboard" >Home</a></li>
											<li className="breadcrumb-item"><a href="/dashboard">Transaction</a></li>
											<li className="breadcrumb-item active" aria-current="page">List Event</li>
										</ul>
									</nav>
								</div>
								<div>
									{this.state.alertData.status === 1 ? (
			              <Alert className="alert alert-succes alert-dismissible fade show">
			                <b>{this.state.alertData.message}</b>
			                <button 
			                	type="button" 
			                	className="close" 
			                	data-dismiss="alert"
			                	onClick={this.closeAlert} 
			                	aria-label="Close">
							          <span>&times;</span>
							        </button>
			              </Alert>
			            ) : ("")
									}
									{this.state.alertData.status === 2 ? (
			              <Alert className="alert alert-danger alert-dismissible fade show">
			                <b>{this.state.alertData.message}</b>
			                <button 
			                	type="button" 
			                	className="close" 
			                	data-dismiss="alert" 
			                	aria-label="Close"
			                	onClick={this.closeAlert}>
						          <span>&times;</span>
						        </button>
			              </Alert>
			            ) : ("")
									}
								<CreateEvent
									event={this.state.event}
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
                        <select
                          name="status"
                          className="form-control"
                          onChange={this.changeHandler}
                          defaultValue=""
                        >
                        <option value="" >Status...</option>
                          {this.state.status.map((row,x) => {
                            return (
                              <option key={row._id} value={row.code}>{row.name}</option>
                          )})}
                        </select>
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
									<br/>
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
											{this.props.event.myEvent.map((row,x)=>
											<tr key={row._id}>
												<td>{x + 1}</td>
												<td>{row.code}</td>
												<td>{row.request_by_first_name + " " 
													+ row.request_by_last_name }</td>
												<td>{row.request_date}</td>
												<td>{row.status}</td>
												<td>{row.created_date}</td>
												<td>{row.created_by_employee}</td>
												<td>
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
					</div>
        </div>
      </div>
		)
	}
}

ListEvent.propTypes = {
  getAllEvent: PropTypes.func.isRequired,
  searchEvent: PropTypes.func.isRequired,
  eraseStatus: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  event: state.event,
  employee: state.employee,
  status: state.event.status
});

export default connect(
	mapStateToProps,{ getAllEvent, searchEvent, eraseStatus }
	)( ListEvent );