import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { getAllPromotion } from '../../../actions/promotionActions';
import { connect } from 'react-redux';
import CreatePromotion from './createPromotion';
import PropTypes from 'prop-types';
import {
	withStyles,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableFooter,
	TablePagination,
	IconButton,
	Paper,
	Input,
	Button,
	Grid
} from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Gavel from '@material-ui/icons/Gavel';
import Assignment from '@material-ui/icons/Assignment';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import moment from 'moment';

const actionsStyles = (theme) => ({
	root: {
		flexShrink: 0,
		color: theme.palette.text.secondary,
		marginLeft: theme.spacing.unit * 2.5
	}
});

class TablePaginationActions extends React.Component {
	handleFirstPageButtonClick = (event) => {
		this.props.onChangePage(event, 0);
	};

	handleBackButtonClick = (event) => {
		this.props.onChangePage(event, this.props.page - 1);
	};

	handleNextButtonClick = (event) => {
		this.props.onChangePage(event, this.props.page + 1);
	};

	handleLastPageButtonClick = (event) => {
		this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1));
	};

	render() {
		const { classes, count, page, rowsPerPage, theme } = this.props;

		return (
			<div className={classes.root}>
				<IconButton onClick={this.handleFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
					{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
				</IconButton>
				<IconButton onClick={this.handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
					{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
				</IconButton>
				<IconButton
					onClick={this.handleNextButtonClick}
					disabled={page >= Math.ceil(count / rowsPerPage) - 1}
					aria-label="Next Page"
				>
					{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
				</IconButton>
				<IconButton
					onClick={this.handleLastPageButtonClick}
					disabled={page >= Math.ceil(count / rowsPerPage) - 1}
					aria-label="Last Page"
				>
					{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
				</IconButton>
			</div>
		);
	}
}

TablePaginationActions.propTypes = {
	classes: PropTypes.object.isRequired,
	count: PropTypes.number.isRequired,
	onChangePage: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
	theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
	withTheme: true
})(TablePaginationActions);

class ListPromotion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: {
				code: null,
				request_by: null,
				request_date: null,
				assign_to: null,
				status: null,
				created_date: null,
				created_by: null
			},
			showCreatePromotion: false,
			allPromotion: [],
			currentPromotion: {},
			alertData: {
				status: 0,
				message: '',
				code: ''
			},
			hasil: [],
			page: 0,
			rowsPerPage: 5
		};
		this.showHandler = this.showHandler.bind(this);
		this.changeHandler = this.changeHandler.bind(this);
		this.closeModalHandler = this.closeModalHandler.bind(this);
		this.closeHandler = this.closeHandler.bind(this);
		this.viewModalHandler = this.viewModalHandler.bind(this);
		this.editModalHandler = this.editModalHandler.bind(this);
		this.modalStatus = this.modalStatus.bind(this);
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value });
	};

	componentDidMount() {
		this.props.getAllPromotion();
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			allPromotion: newProps.ambil.promotion,
			hasil: newProps.ambil.promotion
		});
	}

	deleteModalHandler(promotionid) {
		let tmp = {};
		this.state.allPromotion.map((ele) => {
			if (promotionid === ele._id) {
				tmp = ele;
			}
			return tmp;
		});
		this.setState({
			currentPromotion: tmp,
			deletePromotion: true
		});
	}

	viewModalHandler(promotionid) {
		let tmp = {};
		this.state.allPromotion.map((ele) => {
			if (promotionid === ele._id) {
				tmp = ele;
			}
			return tmp;
		});
		this.setState({
			currentPromotion: tmp,
			viewPromotion: true
		});
	}

	editModalHandler(data) {
		localStorage.setItem('MARKETING-HEADER-PROMOTION', JSON.stringify(data));
		if (data.flag_design == 1) {
			window.location.href = '/editpromot-d';
		} else if (data.flag_design == 0) {
			window.location.href = '/editpromot-nd';
		}
	}

	changeHandler(e) {
		let temp = this.state.search;
		if (e.target.value === '') {
			temp[e.target.name] = null;
			this.setState({
				search: temp
			});
		} else {
			if (e.target.name === 'created_date' || e.target.name === 'request_date') {
				temp[e.target.name] = moment(e.target.value).format('DD/MM/YYYY');
				this.setState({
					search: temp
				});
			} else {
				temp[e.target.name] = e.target.value;
				this.setState({
					search: temp
				});
			}
		}
	}
	keyHandler = (event) => {
		if (event.key === 'Enter') this.search();
	};
	search = () => {
		let patt = {
			code: new RegExp(this.state.search.code, 'i'),
			request_date: new RegExp(this.state.search.request_date),
			request_by: new RegExp(this.state.search.request_by, 'i'),
			assign_to: new RegExp(this.state.search.assign_to, 'i'),
			status: new RegExp(this.state.search.status, 'i'),
			created_date: new RegExp(this.state.search.created_date),
			created_by: new RegExp(this.state.search.created_by)
		};

		let newResult = this.state.allPromotion
			.map((content) => {
				if (
					patt.code.test(content.code) ||
					patt.request_by.test(content.request_by) ||
					patt.created_by.test(content.created_by) ||
					patt.created_date.test(content.created_date) ||
					patt.request_date.test(content.request_date) ||
					patt.assign_to.test(this.showAssign(content.assign_to)) ||
					patt.status.test(this.showstatus(content.status))
				)
					return content;
				else return false;
			})
			.filter((a) => a !== false);
		this.setState({
			hasil: newResult
		});
	};

	closeModalHandler() {
		this.setState({
			viewPromotion: false,
			editPromotion: false,
			deletePromotion: false
		});
	}

	showHandler() {
		this.setState({ showCreatePromotion: true });
	}

	closeHandler() {
		this.setState({ showCreatePromotion: false });
	}

	showstatus(code) {
		if (parseInt(code) === 1) return 'Submitted';
		else if (parseInt(code) === 2) return 'In Progress';
		else if (parseInt(code) === 3) return 'Done';
		else if (parseInt(code) === 0) return 'Rejected';
	}
	modalStatus(status, message, code) {
		this.setState({
			alertData: {
				status: status,
				message: message,
				code: code
			},
			viewPromotion: false,
			editPromotion: false,
			deletePromotion: false
		});
	}
	showAssign(code) {
		if (code == null) return 'None';
		else return code;
	}
	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="card border-primary mb-3">
							<div className="card-header lead">List Marketing Promotion</div>
							<div className="card-body">
								<nav aria-label="breadcrumb mb-4">
									<ol className="breadcrumb">
										<li className="breadcrumb-item">
											<Link to="/">Home</Link>
										</li>
										<li className="breadcrumb-item active" aria-current="page">
											List Promotion
										</li>
									</ol>
								</nav>
								<div className="form-row">
									<div className="col-sm-1">
										<input
											class="form-control"
											placeholder="Transaction Code"
											name="code"
											onChange={this.changeHandler}
											onKeyPress={this.keyHandler}
										/>
									</div>
									<div className="col-md-1">
										<input
											class="form-control"
											placeholder="Request By"
											name="request_by"
											onChange={this.changeHandler}
											onKeyPress={this.keyHandler}
										/>
									</div>
									<div className="col-md-2">
										<input
											class="form-control"
											placeholder="Request Date"
											name="request_date"
											type="date"
											onChange={this.changeHandler}
											onKeyPress={this.keyHandler}
										/>
									</div>
									<div className="col-md-1">
										<input
											class="form-control"
											placeholder="Assign to"
											name="assign_to"
											onChange={this.changeHandler}
											onKeyPress={this.keyHandler}
										/>
									</div>

									<div className="col-md-1">
										<input
											class="form-control"
											placeholder="Status"
											type="text"
											name="status"
											onChange={this.changeHandler}
											onKeyPress={this.keyHandler}
										/>
									</div>
									<div className="col-md-2">
										<input
											class="form-control"
											placeholder="Created Date"
											type="date"
											name="created_date"
											onChange={this.changeHandler}
											onKeyPress={this.keyHandler}
										/>
									</div>
									<div className="col-md-1">
										<input
											class="form-control"
											placeholder="Created By"
											type="text"
											name="created_by"
											onChange={this.changeHandler}
											onKeyPress={this.keyHandler}
										/>
									</div>
									<div className="col-xs-1">
										<Button variant="contained" color="primary" size="small" onClick={this.search}>
											Search
										</Button>
									</div>
									<div className="col-xs-1">
										<Button
											variant="contained"
											color="warning"
											size="small"
											onClick={() => {
												this.setState({ hasil: this.state.allPromotion });
											}}
										>
											Refresh
										</Button>
									</div>
									<div className="col-xs-1">
										<Button
											variant="contained"
											color="primary"
											size="small"
											onClick={this.showHandler}
										>
											Add Promotion
										</Button>
									</div>
								</div>
								<br />
								<br />
								{this.state.hasil.length === 0 ? (
									<h5>Loading Data, Please Wait!</h5>
								) : (
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Transaction Code</TableCell>
												<TableCell>Request By</TableCell>
												<TableCell>Request Date</TableCell>
												<TableCell>Assign to</TableCell>
												<TableCell>Status</TableCell>
												<TableCell>Created Date</TableCell>
												<TableCell>Created By</TableCell>
												<TableCell>Action</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.hasil
												.slice(
													this.state.page * this.state.rowsPerPage,
													this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
												)
												.map((row, index) => {
													return (
														<TableRow key={row._id}>
															<TableCell>{row.code}</TableCell>
															<TableCell>{row.request_by}</TableCell>
															<TableCell>{row.request_date}</TableCell>
															<TableCell>{this.showAssign(row.assign_to)}</TableCell>
															<TableCell>{this.showstatus(row.status)}</TableCell>
															<TableCell>{row.created_date}</TableCell>
															<TableCell>{row.created_by}</TableCell>
															<TableCell>
																<Link to="#">
																	<CreateOutlinedIcon
																		onClick={() => {
																			this.editModalHandler(row);
																		}}
																	/>
																</Link>
																<a href="#">
																	<Gavel />
																</a>
																<a href="#">
																	<Assignment />
																</a>
															</TableCell>
														</TableRow>
													);
												})}
										</TableBody>
										<TableFooter>
											<TableRow>
												<TablePagination
													colSpan={5}
													count={this.state.hasil.length}
													rowsPerPage={this.state.rowsPerPage}
													page={this.state.page}
													onChangePage={this.handleChangePage}
													onChangeRowsPerPage={this.handleChangeRowsPerPage}
													ActionsComponent={TablePaginationActionsWrapped}
												/>
											</TableRow>
										</TableFooter>
									</Table>
								)}
							</div>
						</div>
					</div>
				</div>
				<div>
					<CreatePromotion
						create={this.state.showCreatePromotion}
						closeHandler={this.closeHandler}
						modalStatus={this.modalStatus}
					/>
				</div>
			</div>
		);
	}
}

ListPromotion.propTypes = {
	getAllPromotion: PropTypes.func.isRequired,
	ambil: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	ambil: state.promot,
	data: state.auth
});

export default connect(mapStateToProps, { getAllPromotion })(ListPromotion);
