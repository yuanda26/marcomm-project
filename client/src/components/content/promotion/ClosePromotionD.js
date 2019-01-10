import React from "react";
import { Alert } from "reactstrap";
import {
  getAllPromotion,
  closePromotion,
  getDesignByCode
} from "../../../actions/promotionActions";
import { getDesignItem } from "../../../actions/promotionItemActions";
import { getFile } from "../../../actions/promotionFileActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import SaveOutlinedIcon from "@material-ui/icons/SaveAltOutlined";
import moment from "moment";
import { getAllEmployee } from "../../../actions/employeeAction";
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
  modalStatus(status, message, code = 200) {
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
  changeByIndex = (index, item = true) => evt => {
    if (item) {
      let item2 = this.state.designItem.map((shareholder, sidx) => {
        if (index !== sidx) return shareholder;
        return {
          ...shareholder,
          [evt.target.name]: evt.target.value
        };
      });
      this.setState({ designItem: item2 });
    } else {
      let item2 = this.state.oldFile.map((shareholder, sidx) => {
        if (index !== sidx) return shareholder;
        return {
          ...shareholder,
          [evt.target.name]: evt.target.value
        };
      });
      this.setState({ oldFile: item2 });
    }
  };
  reject = () => {
    const validate = (item, file) => {
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
      let data2 = [];
      if (file.length !== 0) {
        data2 = file
          .map(content => {
            if (
              moment(content.start_date).subtract(1, "days") <
              moment(content.end_date)
            ) {
              return true;
            }
            return false;
          })
          .filter(a => a === false);
      }
      if (data.length === 0 && data2.length === 0) return true;
      return false;
    };
    if (validate(this.state.designItem, this.state.oldFile)) {
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

  // when submit
  submitHandler = () => {
    let temp = this.state.marketHeader;
    temp.status = 3;
    this.setState({
      marketHeader: temp
    });
    let data = {
      marketHeader: this.state.marketHeader,
      designHeader: this.state.designHeader,
      designItem: this.state.designItem,
      oldFile: this.state.oldFile
    };
    this.props.closePromotion(data, this.modalStatus);
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
              <li className="active">{`Close Marketing Promotion ${
                this.state.marketHeader.code
              }`}</li>
            </ul>
          </Grid>
          <Grid item xs={12}>
            <h4>{`Close Marketing Promotion ${
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
                      placeholder={this.state.marketHeader.title}
                      type="text"
                      class="form-control"
                      id="titleheader"
                      disabled
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
                      placeholder={this.state.marketHeader.note}
                      disabled
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

          {/* Render of DESIGN HEADER INFORMATION */}
          <div class="card mb-3">
            <div class="card-body">
              <h6 class="card-title">{`DESIGN HEADER INFORMATION - ${
                this.state.designHeader.code
              }`}</h6>
              <hr />
              <div class="form-row">
                <div class="form-group col-md-6 row">
                  <label
                    for="designcode"
                    class="col-4 col-form-label text-right"
                  >
                    * Design Code
                  </label>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      id="designcode"
                      placeholder={this.state.designHeader.code}
                      disabled
                    />
                  </div>
                </div>
                <div class="form-group col-md-6 row">
                  <label
                    for="titleheader"
                    class="col-4 col-form-label text-right"
                  >
                    * Title Header
                  </label>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      id="titleheader"
                      placeholder={this.state.designHeader.title_header}
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
                      id={"requestby"}
                      placeholder={this.state.designHeader.request_by}
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
                      placeholder={this.state.designHeader.request_date}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6 row">
                  <label for="note" class="col-4 col-form-label text-right">
                    * Note
                  </label>
                  <div class="col-8">
                    <textarea
                      class="form-control"
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
          <div class="card mb-3">
            <div class="card-body">
              <h6 class="card-title">{`DESIGN ITEM INFORMATION - ${
                this.state.designHeader.code
              }`}</h6>
              <hr />
              <div class="table-responsive">
                <table class="table-borderless table-sm">
                  <thead>
                    <tr className="text-center">
                      <th>Product Name</th>
                      <th>Descripton</th>
                      <th>Title</th>
                      <th>Qty</th>
                      <th>Todo</th>
                      <th>Due Date</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Note</th>
                      <th />
                    </tr>
                  </thead>
                  {this.state.designItem.map((content, index) => (
                    <tr>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          placeholder={content.product_name}
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          placeholder={content.description}
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          placeholder={content.title_item}
                          disabled
                        />
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
                          value={content.start_date}
                          name="start_date"
                          onChange={this.changeByIndex(index)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          class="form-control"
                          id="enddate"
                          value={content.end_date}
                          name="end_date"
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
                </table>
              </div>
            </div>
          </div>
          {/* End of Render DESIGN ITEM INFORMATION */}

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
                      <tr className="text-center">
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
                              value={content.start_date}
                              name="start_date"
                              onChange={this.changeByIndex(index, false)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              id="enddate"
                              value={content.end_date}
                              name="end_date"
                              onChange={this.changeByIndex(index, false)}
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
                onClick={this.reject}
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
          submit={this.submitHandler}
        />
      </div>
    );
  }
}

addPromotionD.propTypes = {
  getAllPromotion: PropTypes.func.isRequired,
  ambil: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  closePromotion: PropTypes.func.isRequired,
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
    closePromotion,
    getDesignByCode,
    getDesignItem,
    getFile,
    getAllEmployee
  }
)(addPromotionD);
