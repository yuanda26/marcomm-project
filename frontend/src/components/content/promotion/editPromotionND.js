import React from "react";
import { Alert } from "reactstrap";
import { getAllPromotion } from "../../../actions/promotionActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import apiConfig from "../../../config/Host_Config";
import axios from "axios";
import SaveIcon from "@material-ui/icons/SaveAltOutlined";
import moment from "moment";
class addPromotionD extends React.Component {
  constructor(props) {
    super(props);
    let data = JSON.parse(localStorage.getItem("MARKETING-HEADER-PROMOTION"));
    this.username = this.props.data.user.m_employee_id;
    this.t_event_id = data.t_event_id;
    this.t_design_id = data.t_design_id;
    this.state = {
      shareholders: [],
      marketHeader: {
        _id: data._id,
        code: data.code,
        t_event_id: this.t_event_id,
        request_by: this.username,
        request_date: data.request_date,
        title: data.title,
        note: data.note,
        flag_design: data.flag_design,
        t_design_id: this.t_design_id,
        created_by: this.username,
        status: data.status,
        updated_by: this.username
      },
      oldFile: [],
      alertData: {
        status: 0,
        message: "",
        code: ""
      }
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
    this.getFile = this.getFile.bind(this);
  }
  //<<-----------------Setting of MARKETING HEADER------------------>>>
  componentWillReceiveProps(newProps) {
    this.setState({
      formdata: newProps.ambil.dataP
    });
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
  changeHandler(event) {
    let tmp = this.state.marketHeader;
    tmp[event.target.name] = event.target.value;
    this.setState({
      marketHeader: tmp
    });
  }
  //<<----------------End of Setting MARKETING HEADER---------------->>>

  //<<--------------Setting of shareholder (UPLOAD FILE)------------->>>
  //get old file
  getFile(codePromotion) {
    let token = localStorage.token;
    let option = {
      url: apiConfig + "/promotionfile/" + codePromotion,
      method: "get",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    };
    axios(option)
      .then(res => {
        this.setState({
          oldFile: res.data.message
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  // when name change
  changeByIndex = (idx, flag = "file") => evt => {
    if (flag === "oldFile") {
      let item2 = this.state.oldFile.map((shareholder, sidx) => {
        if (idx !== sidx) return shareholder;
        return {
          ...shareholder,
          [evt.target.name]: evt.target.value
        };
      });
      this.setState({ oldFile: item2 });
    } else {
      let item2 = this.state.shareholders.map((shareholder, sidx) => {
        if (idx !== sidx) return shareholder;
        return {
          ...shareholder,
          [evt.target.name]: evt.target.value
        };
      });
      this.setState({ shareholders: item2 });
    }
  };
  // when add item
  handleAddShareholder = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([
        {
          fileName: null,
          qty: null,
          todo: "null",
          dueDate: null,
          note: null,
          created_by: this.username
        }
      ])
    });
  };
  //when remove one item
  handleRemoveShareholder = (idx, flag = "item") => () => {
    if (flag === "item") {
      this.setState({
        shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx)
      });
    } else {
      this.setState({
        oldFile: this.state.oldFile.filter((s, sidx) => idx !== sidx)
      });
    }
  };

  // when submit
  submitHandler = () => {
    // console.log(JSON.stringify(this.state.oldFile))
    const validateFile = input => {
      let reg = /^[1234567890]+$/;
      let lala = input
        .map(content => {
          if (
            moment(content.request_due_date) < moment() ||
            content.filename === null ||
            !reg.test(content.qty) ||
            content.todo === "null"
          ) {
            return null;
          } else {
            return content;
          }
        })
        .filter(a => a != null);

      if (lala.length === 0) {
        return "Something Wrong";
      } else {
        return true;
      }
    };
    const validateNewFile = input => {
      let reg = /^[1234567890]+$/;
      if (input.length === 0) {
        return "Nothing Input";
      } else {
        let lala = input
          .map(content => {
            if (
              moment(content.request_due_date) < moment() ||
              content.fileName === null ||
              !reg.test(content.qty) ||
              content.todo === "null"
            ) {
              return null;
            }
            return content;
          })
          .filter(a => a != null);

        if (lala.length === 0) {
          return "Something Wrong";
        } else {
          return true;
        }
      }
    };

    if (
      validateNewFile(this.state.shareholders) !== "Something Wrong" &&
      this.state.marketHeader.title !== "" &&
      validateFile(this.state.oldFile) !== "Something Wrong"
    ) {
      let data = {
        marketHeader: this.state.marketHeader,
        oldFile: this.state.oldFile,
        designItem: null,
        file: this.state.shareholders
      };
      let token = localStorage.token;
      let option = {
        url: apiConfig + "/promotion/" + data.marketHeader._id,
        method: "put",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        data: data
      };
      axios(option)
        .then(response => {
          this.modalStatus(
            1,
            "Data Saved!, Transaction request has been updated with code " +
              data.marketHeader.code +
              "!",
            200
          );
          setTimeout(() => {
            window.location.href = "/promotion";
          }, 3000);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.modalStatus(2, "Something wrong, please type correctly!!", 200);
    }
  };

  //<<----------------End of Setting UPLOAD FILE-------------->>>
  componentDidMount() {
    this.getFile(this.state.marketHeader.code);
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
              <li className="active">Add Marketing Promotion</li>
            </ul>
          </Grid>
          <Grid item xs={12}>
            <h4>Add Marketing Promotion</h4>
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
                      placeholder={this.state.marketHeader.status}
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
          {/* End of Render MARKETING HEADER PROMOTION*/}

          {/* <<-----Render of UPLOAD FILE------------>>*/}
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
                                type="file"
                                id="customFile"
                                class="custom-file-input"
                                name="filename"
                                value={content.fileName}
                                onChange={this.changeByIndex(index, "oldFile")}
                              />
                              <label class="custom-file-label" for="customFile">
                                {content.filename + "." + content.extention}
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
                              value={content.qty}
                              onChange={this.changeByIndex(index, "oldFile")}
                            />
                          </td>
                          <td>
                            <select
                              name="todo"
                              id="todo"
                              class="form-control"
                              value={content.todo}
                              onChange={this.changeByIndex(index, "oldFile")}
                            >
                              <option selected value={content.todo} disabled>
                                {content.todo}
                              </option>
                              <option value="PRINT"> Print </option>
                              <option value="UPLOAD SOSMED">
                                {" "}
                                Upload Sosmed{" "}
                              </option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="date"
                              class="form-control"
                              name="request_due_date"
                              placeholder={content.request_due_date}
                              value={content.request_due_date}
                              onChange={this.changeByIndex(index, "oldFile")}
                              id="duedate"
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
                              name="note"
                              value={content.note}
                              onChange={this.changeByIndex(index, "oldFile")}
                              placeholder={content.note}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              color="primary"
                              onClick={this.handleRemoveShareholder(
                                index,
                                "oldFile"
                              )}
                              class="btn btn-danger"
                            >
                              {"X"}
                            </button>
                          </td>
                          <td>
                            <button
                              class="btn btn-primary"
                              onClick={() => {
                                window.location.href = "/promotion";
                              }}
                            >
                              <SaveIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </thead>
                  )}
                </table>
              </div>
              <div class="table-responsive">
                <table class="table table-borderless table-sm">
                  {this.state.shareholders.map((shareholder, idx) => (
                    <div className="shareholder">
                      <tr>
                        <td colspan="1">
                          <div class="custom-file">
                            <input
                              type="file"
                              class="custom-file-input"
                              id="customFile"
                              name="fileName"
                              value={shareholder.fileName}
                              onChange={this.changeByIndex(idx)}
                            />
                            <label class="custom-file-label" for="customFile">
                              {shareholder.fileName}
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
                            onChange={this.changeByIndex(idx)}
                          />
                        </td>
                        <td>
                          <select
                            name="todo"
                            value={shareholder.todo}
                            onChange={this.changeByIndex(idx)}
                            class="form-control"
                          >
                            <option value="PRINT">Print</option>
                            <option value="UPLOAD SOSMED">Upload Sosmed</option>
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
                            name="dueDate"
                            value={shareholder.dueDate}
                            onChange={this.changeByIndex(idx)}
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
                            onChange={this.changeByIndex(idx)}
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
                  ))}
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
          {/* <<-----End of Render Submit and Cancel Button------>>*/}
        </form>
      </div>
    );
  }
}

addPromotionD.propTypes = {
  getAllPromotion: PropTypes.func.isRequired,
  ambil: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ambil: state.promot,
  data: state.auth
});

export default connect(
  mapStateToProps,
  { getAllPromotion }
)(addPromotionD);
