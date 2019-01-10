import React from "react";
import { Alert } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import SaveOutlinedIcon from "@material-ui/icons/SaveAltOutlined";
import moment from "moment";
import { getFile } from "../../../actions/promotionFileActions";
import { getAllEmployee } from "../../../actions/employeeAction";
import { closePromotion } from "../../../actions/promotionActions";
import ModalClosePromotion from "./ModalClosePromotion";
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
        assign_to: data.assign_to,
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
    this.props.getFile(this.state.marketHeader.code);
    this.props.getAllEmployee();
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
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
  changeByIndex = index => evt => {
    let item2 = this.state.oldFile.map((shareholder, sidx) => {
      if (index !== sidx) return shareholder;
      return {
        ...shareholder,
        [evt.target.name]: evt.target.value
      };
    });
    this.setState({ oldFile: item2 });
  };
  //<<----------------End of Setting MARKETING HEADER---------------->>>
  // when submit
  submitHandler = () => {
    let temp = this.state.marketHeader;
    temp.status = 3;
    this.setState({
      marketHeader: temp
    });
    let data = {
      marketHeader: this.state.marketHeader,
      designItem: [],
      oldFile: this.state.oldFile
    };

    this.props.closePromotion(data, this.modalStatus, false);
  };
  close = () => {
    const validate = item => {
      let data = item
        .map(content => {
          if (
            moment(content.start_date).subtract(1, "days") <
              moment(content.end_date) &&
            content.start_date !== undefined &&
            content.end_date !== undefined
          ) {
            return true;
          }
          return false;
        })
        .filter(a => a === false);
      if (data.length === 0) return true;
      return false;
    };
    if (validate(this.state.oldFile)) {
      this.setState({
        showReject: true
      });
    } else {
      this.modalStatus(2, `Please type Correctly!`);
      setTimeout(() => {
        this.modalStatus(0, "");
      }, 3000);
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
    return (
      // Header Setting
      <div class="container-fluid">
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
          <div class="card mb-3">
            <div class="card-body">
              <h6 class="card-title">MARKETING HEADER PROMOTION</h6>
              <hr />
              <div class="form-row">
                <div class="form-group col-md-6 row">
                  <label
                    for="transactioncode"
                    class="col-4 col-form-label text-right"
                  >
                    * Transaction Code
                  </label>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      id="transactioncode"
                      placeholder={this.state.marketHeader.code}
                      disabled
                    />
                  </div>
                </div>
                <div class="form-group col-md-6 row">
                  <label
                    for="eventcode"
                    class="col-4 col-form-label text-right"
                  >
                    * Event Code
                  </label>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      id="eventcode"
                      placeholder={this.t_event_id}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6 row">
                  <label
                    for="requestby"
                    class="col-4 col-form-label text-right"
                  >
                    * Request By
                  </label>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      id="requestby"
                      placeholder={this.state.marketHeader.request_by}
                      disabled
                    />
                  </div>
                </div>
                <div class="form-group col-md-6 row">
                  <label
                    for="requestdate"
                    class="col-4 col-form-label text-right"
                  >
                    * Request Date
                  </label>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      id="requestdate"
                      placeholder={this.state.marketHeader.request_date}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6 row">
                  <label
                    for="titleheader"
                    class="col-4 col-form-label text-right"
                  >
                    * Title Header
                  </label>
                  <div class="col-8">
                    <input
                      name="title"
                      value={this.state.marketHeader.title}
                      type="text"
                      class="form-control"
                      id="titleheader"
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
                <div class="form-group col-md-6 row">
                  <label
                    for="requestdate"
                    class="col-4 col-form-label text-right"
                  >
                    Status
                  </label>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      placeholder={this.showStatus(
                        this.state.marketHeader.status
                      )}
                      disabled
                    />
                  </div>
                </div>
                <div class="form-group col-md-6 row">
                  <label for="note" class="col-4 col-form-label text-right">
                    * Note
                  </label>
                  <div class="col-8">
                    <textarea
                      class="form-control"
                      aria-label="With textarea"
                      name="note"
                      value={this.state.marketHeader.note}
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
                <div class="form-group col-md-6 row">
                  <label for="note" class="col-4 col-form-label text-right">
                    * Assign To
                  </label>
                  <div class="col-8">
                    <input
                      type="text"
                      className="form-control"
                      placeHolder={this.state.marketHeader.assign_to}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End of Render MARKETING HEADER PROMOTION*/}

          {/* <<-----Render of UPLOAD FILE------------>>*/}
          <div class="card mb-3">
            <div class="card-body">
              <h6 class="card-title">UPLOAD FILE</h6>
              <hr />
              <div class="table-responsive">
                <table class="table table-borderless table-sm">
                  {this.state.oldFile.length === 0 ? (
                    <div />
                  ) : (
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Qty</th>
                        <th>Todo</th>
                        <th>Due Date</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Note</th>
                        <th />
                      </tr>
                      {this.state.oldFile.map((content, index) => (
                        <tr>
                          <td colspan="1">
                            <div class="custom-file">
                              <input
                                type="text"
                                class="form-control"
                                placeholder={content.filename}
                                disabled
                              />
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control"
                              placeholder={content.qty}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control"
                              placeholder={content.todo}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control"
                              placeholder={content.request_due_date}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              id="startdate"
                              name="start_date"
                              value={content.start_date}
                              onChange={this.changeByIndex(index)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              name="end_date"
                              value={content.end_date}
                              onChange={this.changeByIndex(index)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control"
                              placeholder={content.note}
                              disabled
                            />
                          </td>
                          <td>
                            <button
                              class="btn btn-primary"
                              onClick={() => {
                                window.location.href = "/promotion";
                              }}
                            >
                              <SaveOutlinedIcon />
                            </button>
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
          <div class="form-group row">
            <div class="col d-flex justify-content-end">
              <button
                onClick={this.close}
                type="button"
                class="btn btn-primary float-right mr-1"
              >
                Close Request
              </button>
              <button
                type="button"
                class="btn btn-warning  float-right ml-1"
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
        <ModalClosePromotion
          isReject={this.state.showReject}
          closeHandler={this.closeHandler}
          modalStatus={this.modalStatus}
          submit={this.submitHandler}
        />
      </div>
    );
  }
}

addPromotionD.propTypes = {
  data: PropTypes.object.isRequired,
  getFile: PropTypes.func.isRequired,
  closePromotion: PropTypes.func.isRequired,
  getAllEmployee: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  promotionFile: state.promotFile,
  data: state.auth,
  employee: state.employee
});

export default connect(
  mapStateToProps,
  {
    getFile,
    getAllEmployee,
    closePromotion
  }
)(addPromotionD);
