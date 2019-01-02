import React from "react";
import { Alert } from "reactstrap";
import { getAllPromotion } from "../../../actions/promotionActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import apiConfig from "../../../config/Host_Config";
import axios from "axios";
import SaveOutlinedIcon from "@material-ui/icons/SaveAltOutlined";
import moment from "moment";
//import Lala from "./coba"
class addPromotionD extends React.Component {
  constructor(props) {
    super(props);
    let data = JSON.parse(localStorage.getItem("MARKETING-HEADER-PROMOTION"));
    this.username = this.props.data.user.m_employee_id;
    this.t_event_id = data.t_event_id;
    this.t_design_id = data.t_design_id;
    this.state = {
      dataOldFile: [],
      shareholders: [],
      dataNewFile: [],
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
      designItem2: [],
      oldFile: [],
      alertData: {
        status: 0,
        message: "",
        code: ""
      }
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
    this.getDesignItem = this.getDesignItem.bind(this);
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
      alertData: {
        status: false,
        message: ""
      },
      marketHeader: tmp
    });
  }
  //<<----------------End of Setting MARKETING HEADER---------------->>>

  //<<----------------Setting Market Header Information------------>>
  getDesignByCode(code) {
    let token = localStorage.token;
    let option = {
      url: apiConfig.host + "/design/" + code,
      method: "get",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    };
    axios(option)
      .then(res => {
        this.setState({
          designHeader: res.data.message
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getDesignItem(code, design) {
    let token = localStorage.token;
    let option = {
      url: apiConfig.host + "/promotion_item/" + code + "/" + design,
      method: "get",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    };
    axios(option)
      .then(res => {
        this.setState({
          designItem: res.data.message[0],
          designItem2: res.data.message[1]
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  //<<--------------Setting of shareholder (UPLOAD FILE)------------->>>
  //get old file
  getFile(codePromotion) {
    let token = localStorage.token;
    let option = {
      url: apiConfig.host + "/promotionfile/" + codePromotion,
      method: "get",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    };
    axios(option)
      .then(res => {
        this.setState({
          oldFile: res.data.message,
          dataOldFile: res.data.message.map(content => content.filename)
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  // when name change
  changeByIndex = (idx, flag = "file") => evt => {
    if (flag === "item") {
      let item2 = this.state.designItem.map((shareholder, sidx) => {
        if (idx !== sidx) return shareholder;
        return {
          ...shareholder,
          [evt.target.name]: evt.target.value
        };
      });
      this.setState({ designItem: item2 });
    } else if (flag === "oldFile") {
      let item2 = this.state.oldFile.map((shareholder, sidx) => {
        if (idx !== sidx) return shareholder;
        return {
          ...shareholder,
          [evt.target.name]: evt.target.value
        };
      });
      let item3 = this.state.dataOldFile.map((content, index) => {
        if (idx !== index) return content;
        return {
          ...content,
          [evt.target.name]: evt.target.value
        };
      });
      this.setState({
        oldFile: item2,
        dataOldFile: item3
      });
    } else {
      let item2 = this.state.shareholders.map((shareholder, sidx) => {
        if (idx !== sidx) return shareholder;
        if (evt.target.name === "fileName") {
          return {
            ...shareholder,
            [evt.target.name]: evt.target.files[0].name,
            size: evt.target.files[0].size / 1024.0 + " kb",
            extention: evt.target.files[0].type
          };
        }
        return {
          ...shareholder,
          [evt.target.name]: evt.target.value
        };
      });
      this.setState({
        shareholders: item2
      });
    }
  };
  // when add item
  handleAddShareholder = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([
        {
          fileName: null,
          size: null,
          extention: null,
          qty: null,
          todo: "null",
          dueDate: null,
          note: null,
          created_by: this.username
        }
      ]),
      dataNewFile: this.state.dataNewFile.concat([
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
        shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx),
        dataNewFile: this.state.dataNewFile.filter((s, sidx) => idx !== sidx)
      });
    } else {
      this.setState({
        oldFile: this.state.oldFile.filter((s, sidx) => idx !== sidx),
        dataOldFile: this.state.dataOldFile.filter((s, sidx) => idx !== sidx)
      });
    }
  };

  // when submit
  submitHandler = () => {
    const validate = (marketHeader, designItem, oldFile, newFile) => {
      const validateDesignItem = designItem
        .map(content => {
          if (typeof parseInt(content.qty) !== "number") return false;
          else if (
            content.request_due_date === "" ||
            moment(content.request_due_date) < moment().subtract(1, "days")
          )
            return false;
          else return true;
        })
        .filter(a => a !== true);
      let validateNewFile = true;
      if (newFile.length !== 0) {
        let test = newFile
          .map(content => {
            if (content.fileName === "") return false;
            else if (typeof parseInt(content) !== "number") return false;
            else if (content.todo === "null") return false;
            else if (content.dueDate === null) return false;
            else return true;
          })
          .filter(a => a !== true);
        if (test.length !== 0) {
          validateNewFile = false;
        }
      }

      // const validateOdlFile = file => {
      //   if (file.length === 0) return true;
      //   else {
      //     // validateFile = file.map(content => {
      //     //   return true;
      //     // });
      //   }
      // }
      if (
        marketHeader.title === "" ||
        marketHeader.note === "" ||
        validateDesignItem.length !== 0 ||
        validateNewFile === false
      ) {
        return false;
      } else return true;
    };
    let data = {
      marketHeader: this.state.marketHeader,
      designHeader: this.state.designHeader,
      designItem: this.state.designItem,
      oldFile: this.state.oldFile,
      file: this.state.shareholders
    };
    if (
      validate(data.marketHeader, data.designItem, data.oldFile, data.file) ===
      false
    ) {
      this.modalStatus(2, "Something Wrong, please type correctly!!");
    } else {
      let token = localStorage.token;
      let option = {
        url: apiConfig.host + "/promotion/" + data.marketHeader._id,
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
    }
  };
  //<<----------------End of Setting UPLOAD FILE-------------->>>
  //<<----------------Didmount----------------->>
  componentDidMount() {
    this.getDesignByCode(this.t_design_id);
    this.getDesignItem(this.state.marketHeader.code, this.t_design_id);
    this.getFile(this.state.marketHeader.code);
  }
  // <<-----------End DidMount--------------->>
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
              </div>
            </div>
          </div>
          {/* End of Render MARKETING HEADER PROMOTION*/}

          {/* Render of DESIGN HEADER INFORMATION */}
          <div class="card mb-3">
            <div class="card-body">
              <h6 class="card-title">DESIGN HEADER INFORMATION</h6>
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
              <h6 class="card-title">DESIGN ITEM INFORMATION</h6>
              <hr />
              <div class="table-responsive">
                <table class="table-borderless table-sm">
                  <thead>
                    <tr>
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
                          id="product_name"
                          name="product_name"
                          value={content.product_name}
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          id="productdescription"
                          name="description"
                          value={content.description}
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          id="title"
                          name="title"
                          value={content.title_item}
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          id="qty"
                          name="qty"
                          value={content.qty}
                          onChange={this.changeByIndex(index, "item")}
                        />
                      </td>
                      <td>
                        <select
                          name="todo"
                          id="todo"
                          class="form-control"
                          value={content.todo}
                          onChange={this.changeByIndex(index, "item")}
                        >
                          <option selected value={content.todo} disabled>
                            {content.todo}
                          </option>
                          <option value="PRINT"> Print </option>
                          <option value="UPLOAD SOSMED"> Upload Sosmed </option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="date"
                          class="form-control"
                          name="request_due_date"
                          value={content.request_due_date}
                          onChange={this.changeByIndex(index, "item", "date")}
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
                          onChange={this.changeByIndex(index, "item")}
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
                              <option value={content.todo}>
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
                              <SaveOutlinedIcon />
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
                            <option value="null" disabled>
                              {"-Select Option-"}
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
