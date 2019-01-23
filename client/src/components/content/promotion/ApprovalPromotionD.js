import React from "react";
import { Alert } from "reactstrap";
import {
  getAllPromotion,
  putPromotion,
  getDesignByCode
} from "../../../actions/promotionActions";
import { getDesignItem } from "../../../actions/promotionItemActions";
import { getFile } from "../../../actions/promotionFileActions";
import { connect } from "react-redux";
import Select from "react-select";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import SaveOutlinedIcon from "@material-ui/icons/SaveAltOutlined";
import { getAllEmployee } from "../../../actions/employeeAction";
import RejectPromotion from "./RejectPromotion";
import ReactTooltip from "react-tooltip";
class addPromotionD extends React.Component {
  constructor(props) {
    super(props);
    let data = JSON.parse(localStorage.getItem("MARKETING-HEADER-PROMOTION"));
    this.username = this.props.data.user.m_employee_id;
    this.t_event_id = data.t_event_id;
    this.t_design_id = data.t_design_id;
    this.state = {
      showReject: false,
      assign_to: "",
      marketHeader: {
        _id: data._id,
        code: data.code,
        t_event_id: this.t_event_id,
        request_by: data.request_by,
        request_date: data.request_date,
        title: data.title,
        note: data.note,
        flag_design: data.flag_design,
        t_design_id: this.t_design_id,
        created_by: data.created_by,
        status: data.status,
        updated_by: this.username
      },
      designHeader: {},
      designItem: [],
      oldFile: [],
      alertData: {
        status: 0,
        message: "",
        code: ""
      }
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
  }
  componentDidMount() {
    this.props.getDesignByCode(this.t_design_id);
    this.props.getDesignItem(this.state.marketHeader.code, this.t_design_id);
    this.props.getFile(this.state.marketHeader.code);
    this.props.getAllEmployee();
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      designHeader: newProps.ambil.designOne,
      designItem: newProps.promotionItem.promotItem,
      oldFile: newProps.promotionFile.promotFile
    });
  }
  modalStatus(status, message, code) {
    this.setState({
      alertData: {
        status: status,
        message: message,
        code: code
      },
      showReject: false
    });
  }
  closeHandler = () => {
    this.setState({
      showReject: false
    });
  };
  //<<-----------------Setting of MARKETING HEADER------------------>>>
  changeHandler(event) {
    let tmp = this.state.marketHeader;
    tmp[event.target.name] = event.target.value;
    this.setState({
      alertData: {
        status: false,
        message: ""
      },
      marketHeader: tmp
    });
  }
  //<<----------------End of Setting MARKETING HEADER---------------->>>
  selectAssign = selectedOption => {
    this.setState({
      assign_to: selectedOption.value
    });
  };
  // when submit
  submitHandler = () => {
    const validate = marketHeader => {
      if (marketHeader.title === "" || this.state.assign_to === "") {
        return false;
      } else return true;
    };
    let data = {
      marketHeader: {
        _id: this.state.marketHeader._id,
        code: this.state.marketHeader.code,
        title: this.state.marketHeader.title,
        approved_by: this.props.data.user.m_employee_id,
        assign_to: this.state.assign_to,
        note: this.state.marketHeader.note,
        reject_reason: null,
        status: 2
      }
    };
    if (validate(data.marketHeader) === false) {
      this.modalStatus(2, "Something Wrong, please type correctly!!");
    } else {
      this.props.putPromotion(data, this.modalStatus, true, true);
    }
  };
  //<<----------------End of Setting UPLOAD FILE-------------->>>

  showStatus(code) {
    if (parseInt(code) === 1) return "Submitted";
    else if (parseInt(code) === 2) return "In Progress";
    else if (parseInt(code) === 3) return "Done";
    else if (parseInt(code) === 0) return "Rejected";
  }
  // <<----------------------------RENDER---------------------------->>
  render() {
    const selectAssign = this.props.employee.myEmployee
      .map(content => {
        if (content.role === "RO0006") {
          return {
            value: content.employee_number,
            label: content.first_name
          };
        } else return null;
      })
      .filter(a => a !== null);
    return (
      // Header Setting
      <div className="container-fluid">
        {/* <<----------------Link to back------------>> */}
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <br />
            <ul className="breadcrumb">
              <li>
                <a href="/dashboard">Home</a> <span className="divider">/</span>
              </li>
              <li>
                <a href="/dashboard">Master</a>{" "}
                <span className="divider">/</span>
              </li>
              <li>
                <a href="/promotion">List Marketing Promotion</a>{" "}
                <span className="divider">/</span>
              </li>
              <li className="active">{`Approval Marketing Promotion ${
                this.state.marketHeader.code
              }`}</li>
            </ul>
          </Grid>
          <Grid item xs={12}>
            <h4>{`Approval Marketing Promotion ${
              this.state.marketHeader.code
            }`}</h4>
          </Grid>
        </Grid>
        {/* <<-------------End Link to back--------------->> */}

        {/* End of Header Setting */}
        <form>
          {/* Render of MARKETING HEADER PROMOTION */}
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="card-title">MARKETING HEADER PROMOTION</h6>
              <hr />
              <div className="form-row">
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="transactioncode"
                    className="col-4 col-form-label text-right"
                  >
                    * Transaction Code
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      id="transactioncode"
                      placeholder={this.state.marketHeader.code}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="eventcode"
                    className="col-4 col-form-label text-right"
                  >
                    * Event Code
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      id="eventcode"
                      placeholder={this.t_event_id}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="requestby"
                    className="col-4 col-form-label text-right"
                  >
                    * Request By
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      id="requestby"
                      placeholder={this.state.marketHeader.request_by}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="requestdate"
                    className="col-4 col-form-label text-right"
                  >
                    * Request Date
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      id="requestdate"
                      placeholder={this.state.marketHeader.request_date}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="titleheader"
                    className="col-4 col-form-label text-right"
                  >
                    * Title Header
                  </label>
                  <div className="col-8">
                    <input
                      name="title"
                      value={this.state.marketHeader.title}
                      type="text"
                      className="form-control"
                      id="titleheader"
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="requestdate"
                    className="col-4 col-form-label text-right"
                  >
                    Status
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={this.showStatus(
                        this.state.marketHeader.status
                      )}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="note"
                    className="col-4 col-form-label text-right"
                  >
                    * Note
                  </label>
                  <div className="col-8">
                    <textarea
                      className="form-control"
                      aria-label="With textarea"
                      name="note"
                      value={this.state.marketHeader.note}
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="note"
                    className="col-4 col-form-label text-right"
                  >
                    * Select Employee
                  </label>
                  <div className="col-8">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      onChange={this.selectAssign}
                      options={selectAssign}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End of Render MARKETING HEADER PROMOTION*/}

          {/* Render of DESIGN HEADER INFORMATION */}
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="card-title">{`DESIGN HEADER INFORMATION - ${
                this.state.designHeader.code
              }`}</h6>
              <hr />
              <div className="form-row">
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="designcode"
                    className="col-4 col-form-label text-right"
                  >
                    * Design Code
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      id="designcode"
                      placeholder={this.state.designHeader.code}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="titleheader"
                    className="col-4 col-form-label text-right"
                  >
                    * Title Header
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      id="titleheader"
                      placeholder={this.state.designHeader.title_header}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="requestby"
                    className="col-4 col-form-label text-right"
                  >
                    * Request By
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      id={"requestby"}
                      placeholder={this.state.designHeader.request_by}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="requestdate"
                    className="col-4 col-form-label text-right"
                  >
                    * Request Date
                  </label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      id="requestdate"
                      placeholder={this.state.designHeader.request_date}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6 row">
                  <label
                    htmlFor="note"
                    className="col-4 col-form-label text-right"
                  >
                    * Note
                  </label>
                  <div className="col-8">
                    <textarea
                      className="form-control"
                      aria-label="With textarea"
                      placeholder={this.state.designHeader.note}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End of Render DESIGN HEADER INFORMATION */}

          {/* Render of DESIGN ITEM INFORMATION */}
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="card-title">{`DESIGN ITEM INFORMATION - ${
                this.state.designHeader.code
              }`}</h6>
              <hr />
              <div className="table-responsive">
                <table className="table table-borderless">
                  <thead>
                    <tr className="text-center font-weight-bold">
                      <td nowrap="true">Product Name</td>
                      <td nowrap="true">Descripton</td>
                      <td nowrap="true">Title</td>
                      <td nowrap="true">Qty</td>
                      <td nowrap="true">Todo</td>
                      <td nowrap="true">Due Date</td>
                      <td nowrap="true">Start Date</td>
                      <td nowrap="true">End Date</td>
                      <td nowrap="true">Note</td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.designItem.map((content, index) => (
                      <tr key={index.toString()}>
                        <td nowrap="true">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={content.product_name}
                            disabled
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={content.description}
                            disabled
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={content.title_item}
                            disabled
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={content.qty}
                            disabled
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={content.todo}
                            disabled
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={content.request_due_date}
                            disabled
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            type="date"
                            className="form-control"
                            id="startdate"
                            disabled
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            type="date"
                            className="form-control"
                            id="enddate"
                            disabled
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={content.note}
                            disabled
                          />
                        </td>
                        <td>
                          <a href="#!" data-tip="Download File">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                window.location.href = "/promotion";
                              }}
                            >
                              <SaveOutlinedIcon />
                            </button>

                            <ReactTooltip
                              place="top"
                              type="dark"
                              effect="solid"
                            />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* End of Render DESIGN ITEM INFORMATION */}

          {/* <<-----Render of UPLOAD FILE------------>>*/}
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="card-title">UPLOAD FILE</h6>
              <hr />
              <div className="table-responsive">
                <table className="table table-borderless table-sm">
                  {this.state.oldFile.length === 0 ? (
                    <thead />
                  ) : (
                    <thead>
                      <tr className="text-center font-weight-bold">
                        <td nowrap="true">File Name</td>
                        <td nowrap="true">Qty</td>
                        <td nowrap="true">Todo</td>
                        <td nowrap="true">Due Date</td>
                        <td nowrap="true">Start Date</td>
                        <td nowrap="true">End Date</td>
                        <td nowrap="true">Note</td>
                      </tr>
                      {this.state.oldFile.map((content, index) => (
                        <tr key={index.toString()}>
                          <td nowrap="true" colSpan="1">
                            <div className="custom-file">
                              <input
                                type="text"
                                className="form-control"
                                placeholder={content.filename}
                                disabled
                              />
                            </div>
                          </td>
                          <td nowrap="true">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={content.qty}
                              disabled
                            />
                          </td>
                          <td nowrap="true">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={content.todo}
                              disabled
                            />
                          </td>
                          <td nowrap="true">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={content.request_due_date}
                              disabled
                            />
                          </td>
                          <td nowrap="true">
                            <input
                              type="date"
                              className="form-control"
                              id="startdate"
                              disabled
                            />
                          </td>
                          <td nowrap="true">
                            <input
                              type="date"
                              className="form-control"
                              id="enddate"
                              disabled
                            />
                          </td>
                          <td nowrap="true">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={content.note}
                              disabled
                            />
                          </td>
                          <td nowrap="true">
                            <a href="#!" data-tip="Download File">
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  window.location.href = "/promotion";
                                }}
                              >
                                <SaveOutlinedIcon />

                                <ReactTooltip
                                  place="top"
                                  type="dark"
                                  effect="solid"
                                />
                              </button>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </thead>
                  )}
                </table>
              </div>
            </div>
          </div>

          {/* <<----------End of Render UPLOAD FILE ------->>*/}
          {/* Alert Setting */}
          <Grid item xs={6}>
            {this.state.alertData.status === 1 ? (
              <Alert color="success">{this.state.alertData.message}</Alert>
            ) : (
              ""
            )}
            {this.state.alertData.status === 2 ? (
              <Alert color="danger">{this.state.alertData.message}</Alert>
            ) : (
              ""
            )}
          </Grid>
          {/* End of Alert Setting */}
          {/* <<--------Render of Submit and Cancel button------>>*/}
          <div className="form-group row">
            <div className="col d-flex justify-content-end">
              <button
                onClick={this.submitHandler}
                type="button"
                className="btn btn-primary float-right mr-1"
              >
                Approved
              </button>
              <button
                onClick={() => {
                  this.setState({
                    showReject: true
                  });
                }}
                type="button"
                className="btn btn-danger float-right mr-1"
              >
                Rejected
              </button>
              <button
                type="button"
                className="btn btn-warning  float-right ml-1"
                onClick={() => {
                  window.location.href = "/promotion";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          {/* <<-----End of Render Submit and Cancel Button------>>*/}
        </form>
        <RejectPromotion
          isReject={this.state.showReject}
          closeHandler={this.closeHandler}
          modalStatus={this.modalStatus}
          marketHeader={this.state.marketHeader}
        />
      </div>
    );
  }
}

addPromotionD.propTypes = {
  getAllPromotion: PropTypes.func.isRequired,
  ambil: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  putPromotion: PropTypes.func.isRequired,
  getDesignByCode: PropTypes.func.isRequired,
  getDesignItem: PropTypes.func.isRequired,
  getFile: PropTypes.func.isRequired,
  getAllEmployee: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ambil: state.promot,
  promotionItem: state.promotItem,
  promotionFile: state.promotFile,
  data: state.auth,
  employee: state.employee
});

export default connect(
  mapStateToProps,
  {
    getAllPromotion,
    putPromotion,
    getDesignByCode,
    getDesignItem,
    getFile,
    getAllEmployee
  }
)(addPromotionD);
