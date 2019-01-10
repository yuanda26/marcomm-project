import React from "react";
import { Alert } from "reactstrap";
import { createPromotion } from "../../../actions/promotionActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
class addPromotionD extends React.Component {
  constructor(props) {
    super(props);
    let data = JSON.parse(localStorage.getItem("PROMOTION"));
    this.username = this.props.data.user.m_employee_id;
    this.t_event_id = data.t_event_id;
    this.state = {
      lala: "",
      shareholders: [],
      marketHeader: {
        t_event_id: data.t_event_id,
        request_by: this.username,
        request_date: new Date().toDateString(),
        title: "",
        note: "",
        flag_design: data.flag_design,
        t_design_id: null,
        created_by: this.username
      },
      alertData: {
        status: 0,
        message: "",
        code: ""
      }
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
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
  //handle change in MARKETING HEADER PROMOTION
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
  // when name change
  handleShareholderNameChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      if (evt.target.name === "filename") {
        return {
          ...shareholder,
          [evt.target.name]: evt.target.files[0].name,
          size: evt.target.files[0].size / 1024.0 + " kb",
          extention: evt.target.files[0].type
        };
      }
      return { ...shareholder, [evt.target.name]: evt.target.value };
    });
    this.setState({ shareholders: newShareholders });
  };
  // when add item
  handleAddShareholder = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([
        {
          filename: null,
          size: null,
          extention: null,
          qty: null,
          todo: "null",
          request_due_date: null,
          note: null,
          created_by: this.username
        }
      ])
    });
  };
  //when remove one item
  handleRemoveShareholder = idx => () => {
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx)
    });
  };

  // when submit
  submitHandler = () => {
    let reg = /^[1234567890]+$/;
    let lala = this.state.shareholders.filter(
      content =>
        content.filename !== null &&
        reg.test(content.qty) &&
        content.todo !== "null" &&
        moment(content.request_due_date) > moment().subtract(1, "days")
    );
    if (this.state.marketHeader.title !== "" && lala.length > 0) {
      let data = {
        marketHeader: this.state.marketHeader,
        designItem: null,
        file: lala
      };
      this.props.createPromotion(data, this.modalStatus, false);
    } else {
      this.modalStatus(2, "Fill the form!", 400);
    }
  };
  render() {
    return (
      <div class="container-fluid">
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
              <li className="active">Add Marketing Promotion</li>
            </ul>
          </Grid>
          <Grid item xs={12}>
            <h4>Add Marketing Promotion</h4>
          </Grid>
        </Grid>
        <form>
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
                      placeholder="Auto Generated"
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
                      placeholder={this.username}
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
                      placeholder={new Date().toDateString()}
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
                      placeholder="Type Title"
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
                <div class="form-group col-md-6 row">
                  <label for="note" class="col-4 col-form-label text-right">
                    * Note
                  </label>
                  <div class="col-8">
                    <textarea
                      placeholder="Type Note"
                      class="form-control"
                      aria-label="With textarea"
                      name="note"
                      value={this.state.marketHeader.note}
                      onChange={this.changeHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
          <div class="card mb-3">
            <div class="card-body">
              <h6 class="card-title">UPLOAD FILE</h6>
              <hr />
              <div class="form-group row">
                <div class="col">
                  <button
                    type="button"
                    onClick={this.handleAddShareholder}
                    class="btn btn-primary"
                  >
                    Add Item
                  </button>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-borderless table-sm">
                  {this.state.shareholders.map((shareholder, idx) =>
                    idx === 0 ? (
                      <div className="shareholder">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Qty</th>
                            <th>Todo</th>
                            <th>Due Date</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Note</th>
                          </tr>
                        </thead>
                        <tr>
                          <td colspan="1">
                            <div class="custom-file">
                              <input
                                type="file"
                                id="customFile"
                                class="custom-file-input"
                                name="filename"
                                onChange={this.handleShareholderNameChange(idx)}
                              />
                              <label class="custom-file-label" for="customFile">
                                {shareholder.filename}
                              </label>
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control"
                              placeholder="qty"
                              name="qty"
                              id="qty"
                              value={shareholder.qty}
                              onChange={this.handleShareholderNameChange(idx)}
                            />
                          </td>
                          <td>
                            <select
                              name="todo"
                              value={shareholder.todo}
                              onChange={this.handleShareholderNameChange(idx)}
                              class="form-control"
                            >
                              <option value="PRINT">Print</option>
                              <option value="UPLOAD SOSMED">
                                Upload Sosmed
                              </option>
                              <option selected value="null" disabled>
                                -Select-
                              </option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              id="duedate"
                              name="request_due_date"
                              value={shareholder.request_due_date}
                              onChange={this.handleShareholderNameChange(idx)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              id="startdate"
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              id="enddate"
                              disabled
                            />
                          </td>
                          <td>
                            <textarea
                              type="text"
                              class="form-control"
                              id="note"
                              placeholder="Type Note"
                              name="note"
                              value={shareholder.note}
                              onChange={this.handleShareholderNameChange(idx)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              color="primary"
                              onClick={this.handleRemoveShareholder(idx)}
                              class="btn btn-danger"
                            >
                              {"X"}
                            </button>
                          </td>
                        </tr>
                      </div>
                    ) : (
                      <div className="shareholder">
                        <tr>
                          <td colspan="1">
                            <div class="custom-file">
                              <input
                                type="file"
                                class="custom-file-input"
                                id="customFile"
                                name="filename"
                                onChange={this.handleShareholderNameChange(idx)}
                              />
                              <label class="custom-file-label" for="customFile">
                                {shareholder.filename}
                              </label>
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control"
                              id="qty"
                              placeholder="qty"
                              name="qty"
                              value={shareholder.qty}
                              onChange={this.handleShareholderNameChange(idx)}
                            />
                          </td>
                          <td>
                            <select
                              name="todo"
                              value={shareholder.todo}
                              onChange={this.handleShareholderNameChange(idx)}
                              class="form-control"
                            >
                              <option value="PRINT">Print</option>
                              <option value="UPLOAD SOSMED">
                                Upload Sosmed
                              </option>
                              <option value="null" disabled>
                                {"..."}
                              </option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              id="duedate"
                              name="request_due_date"
                              value={shareholder.request_due_date}
                              onChange={this.handleShareholderNameChange(idx)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              id="startdate"
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              id="enddate"
                              disabled
                            />
                          </td>
                          <td>
                            <textarea
                              type="text"
                              class="form-control"
                              id="note"
                              placeholder="Type Note"
                              name="note"
                              value={shareholder.note}
                              onChange={this.handleShareholderNameChange(idx)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              color="primary"
                              onClick={this.handleRemoveShareholder(idx)}
                              class="btn btn-danger"
                            >
                              {"X"}
                            </button>
                          </td>
                        </tr>
                      </div>
                    )
                  )}
                </table>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <div class="col d-flex justify-content-end">
              <button
                onClick={this.submitHandler}
                type="button"
                class="btn btn-primary float-right mr-1"
              >
                Save
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
        </form>
      </div>
    );
  }
}

addPromotionD.propTypes = {
  data: PropTypes.object.isRequired,
  createPromotion: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  data: state.auth
});

export default connect(
  mapStateToProps,
  { createPromotion }
)(addPromotionD);
