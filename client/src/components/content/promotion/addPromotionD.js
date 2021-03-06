import React from "react";
import { Alert } from "reactstrap";
import {
  getDesignByCode,
  createPromotion
} from "../../../actions/promotionActions";
import { getDesignItem } from "../../../actions/promotionItemActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import SaveOutlinedIcon from "@material-ui/icons/SaveAltOutlined";
import moment from "moment";
class addPromotionD extends React.Component {
  constructor(props) {
    super(props);
    let data = JSON.parse(localStorage.getItem("PROMOTION"));
    this.username = this.props.data.user.m_employee_id;
    this.name = this.props.data.user.username;
    this.t_event_id = data.t_event_id;
    this.t_design_id = data.t_design_id;
    this.state = {
      shareholders: [],
      marketHeader: {
        t_event_id: this.t_event_id,
        request_by: this.username,
        request_date: moment().format("DD/MM/YYYY"),
        title: "",
        note: "",
        flag_design: data.flag_design,
        t_design_id: this.t_design_id,
        created_by: this.username
      },
      designHeader: {},
      designItem: [],
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
    this.props.getDesignItem(null, this.t_design_id, "create");
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      designItem: newProps.promotionItem.promotItem,
      designHeader: newProps.ambil.designOne
    });
  }
  //<<-----------------Setting of MARKETING HEADER------------------>>>

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

  //<<--------------Setting of shareholder (UPLOAD FILE)------------->>>
  // when name change
  changeByIndex = (idx, flag = "file") => evt => {
    if (flag !== "file") {
      let item2 = this.state.designItem.map((shareholder, sidx) => {
        if (idx !== sidx) return shareholder;
        if (evt.target.name === "filename") {
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
      this.setState({ designItem: item2 });
    } else {
      let item2 = this.state.shareholders.map((shareholder, sidx) => {
        if (idx !== sidx) return shareholder;
        if (evt.target.name === "filename") {
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
      this.setState({ shareholders: item2 });
    }
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
    const validate = (promotion, item, file) => {
      let reg = /^[1234567890]+$/;
      let validateItem = item
        .map(content => {
          if (
            !reg.test(content.qty) ||
            content.todo === undefined ||
            moment(content.request_due_date) < moment().subtract(1, "days")
          ) {
            return false;
          }
          return true;
        })
        .filter(a => a !== true);
      const validateFile = input => {
        let reg = /^[1234567890]+$/;
        if (input.length === 0) {
          return "Nothing Input";
        } else {
          let lala = input
            .map(content => {
              if (
                moment(content.request_due_date) <
                  moment().subtract(1, "days") ||
                content.filename === null ||
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
        validateFile(file) !== "Something Wrong" &&
        validateItem.length === 0 &&
        promotion.title !== ""
      ) {
        return true;
      } else return false;
    };

    if (
      !validate(
        this.state.marketHeader,
        this.state.designItem,
        this.state.shareholders
      )
    ) {
      this.modalStatus(2, "Something Wrong, please check correctly!", 400);
    } else {
      this.props.createPromotion(
        {
          marketHeader: this.state.marketHeader,
          designHeader: this.state.designHeader,
          designItem: this.state.designItem,
          file: this.state.shareholders
        },
        this.modalStatus
      );
    }
  };
  //<<----------------End of Setting UPLOAD FILE-------------->>>

  // <<----------------------------RENDER---------------------------->>
  render() {
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
                      placeholder="Auto Generated"
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
                      placeholder={this.name}
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
                      placeholder={moment().format("DD/MM/YYYY")}
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
                      placeholder="Type Title"
                      onChange={this.changeHandler}
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
                    <textrea
                      placeholder="Type Note"
                      className="form-control"
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
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="card-title">DESIGN HEADER INFORMATION</h6>
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
              <h6 className="card-title">DESIGN ITEM INFORMATION</h6>
              <hr />
              <div className="table-responsive">
                <table className="table table-borderless">
                  {/* <thead>
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
                    </tr>
                  </thead> */}
                  <tbody>
                    {this.state.designItem.map((content, index) => (
                      <div key={index.toString()}>
                        <tr className="text-center font-weight-bold">
                          <td>Product Name</td>
                          <td>Descripton</td>
                          <td>Title</td>
                          <td>Qty</td>
                          <td>Todo</td>
                        </tr>
                        <tr className="text-center">
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              id="product_name"
                              name="product_name"
                              value={this.state.designItem[index].product_name}
                              placeholder={
                                this.state.designItem[index].product_name
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              id="productdescription"
                              name="description"
                              value={this.state.designItem[index].description}
                              placeholder={
                                this.state.designItem[index].description
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              id="title"
                              name="title"
                              value={this.state.designItem[index].title_item}
                              placeholder={
                                this.state.designItem[index].title_item
                              }
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              id="qty"
                              placeholder="qty"
                              name="qty"
                              value={content.qty}
                              onChange={this.changeByIndex(index, "item")}
                            />
                          </td>
                          <td>
                            <select
                              name="todo"
                              id="todo"
                              className="form-control"
                              value={content.todo}
                              onChange={this.changeByIndex(index, "item")}
                            >
                              <option value="null" disabled>
                                -Select-
                              </option>
                              <option value="PRINT"> Print </option>
                              <option value="UPLOAD SOSMED">
                                {" "}
                                Upload Sosmed{" "}
                              </option>
                            </select>
                          </td>
                        </tr>
                        <tr className="text-center font-weight-bold">
                          <td>Due Date</td>
                          <td>Start Date</td>
                          <td>End Date</td>
                          <td>Note</td>
                        </tr>
                        <tr className="text-center">
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              name="request_due_date"
                              value={content.request_due_date}
                              onChange={this.changeByIndex(index, "item")}
                              id="duedate"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              id="startdate"
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              id="enddate"
                              disabled
                            />
                          </td>
                          <td>
                            <textarea
                              type="text"
                              className="form-control"
                              id="note"
                              name="note"
                              value={content.note}
                              onChange={this.changeByIndex(index, "item")}
                              placeholder="Type Note"
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                localStorage.removeItem("PROMOTION");
                                window.location.href = "/promotion";
                              }}
                            >
                              <SaveOutlinedIcon />
                            </button>
                          </td>
                        </tr>
                      </div>
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
              <div className="form-group row">
                <div className="col">
                  <button
                    type="button"
                    onClick={this.handleAddShareholder}
                    className="btn btn-primary"
                  >
                    Add Item
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-borderless table-sm">
                  {this.state.shareholders.map((shareholder, idx) =>
                    idx === 0 ? (
                      <div key={idx.toString()} className="shareholder">
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
                            <div className="custom-file">
                              <input
                                type="file"
                                id="customFile"
                                className="custom-file-input"
                                name="filename"
                                onChange={this.changeByIndex(idx)}
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="customFile"
                              >
                                {shareholder.filename}
                              </label>
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="qty"
                              name="qty"
                              id="qty"
                              value={shareholder.qty}
                              onChange={this.changeByIndex(idx)}
                            />
                          </td>
                          <td>
                            <select
                              name="todo"
                              value={shareholder.todo}
                              onChange={this.changeByIndex(idx)}
                              className="form-control"
                            >
                              <option value="null" disabled>
                                -Select-
                              </option>
                              <option value="PRINT">Print</option>
                              <option value="UPLOAD SOSMED">
                                Upload Sosmed
                              </option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              id="duedate"
                              name="request_due_date"
                              value={shareholder.request_due_date}
                              onChange={this.changeByIndex(idx)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              id="startdate"
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              id="enddate"
                              disabled
                            />
                          </td>
                          <td>
                            <textarea
                              type="text"
                              className="form-control"
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
                              className="btn btn-danger"
                            >
                              {"X"}
                            </button>
                          </td>
                        </tr>
                      </div>
                    ) : (
                      <div key={idx.toString()} className="shareholder">
                        <tr>
                          <td colspan="1">
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input"
                                id="customFile"
                                name="filename"
                                onChange={this.changeByIndex(idx)}
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="customFile"
                              >
                                {shareholder.filename}
                              </label>
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
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
                              className="form-control"
                            >
                              <option value="null" disabled>
                                -Select-
                              </option>
                              <option value="PRINT">Print</option>
                              <option value="UPLOAD SOSMED">
                                Upload Sosmed
                              </option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              id="duedate"
                              name="request_due_date"
                              value={shareholder.request_due_date}
                              onChange={this.changeByIndex(idx)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              id="startdate"
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              id="enddate"
                              disabled
                            />
                          </td>
                          <td>
                            <textarea
                              type="text"
                              className="form-control"
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
                              className="btn btn-danger"
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
                Save
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
      </div>
    );
  }
}

addPromotionD.propTypes = {
  ambil: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  getDesignByCode: PropTypes.func.isRequired,
  getDesignItem: PropTypes.func.isRequired,
  createPromotion: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  ambil: state.promot,
  data: state.auth,
  promotionItem: state.promotItem
});

export default connect(
  mapStateToProps,
  { getDesignByCode, getDesignItem, createPromotion }
)(addPromotionD);
