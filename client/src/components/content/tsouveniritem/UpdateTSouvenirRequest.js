import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Table,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import moment from "moment";

import { getAllSouvenir } from "../../../actions/souvenirAction";
import { getAllTSouvenirItemDetil } from "../../../actions/tsouveniritemAction";
import {
  updateTSouvenirItem,
  getEvent
} from "../../../actions/tsouveniritemAction";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";

class EditTsouveniritem extends React.Component {
  constructor(props) {
    super(props);
    super(props);
    this.state = {
      formdata: {
        code: "",
        t_event_id: "",
        request_by: "",
        request_date: "",
        request_due_date: "",
        note: "",
        status: "",
        created_by: "",
        created_date: "",
        updated_by: "",
        updated_date: moment().format("YYYY-MM-DD")
      },
      alertData: {
        status: false,
        message: ""
      },
      status: "",
      souvenir: [], //souvenir get from m_souvenir
      item: "",
      shareholders: [], //additem
      dataItem: [], //olditem
      oldFile: [],
      invalid: false,
      userdata: {}
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentDidMount() {
    this.props.getAllSouvenir();
    this.props.getEvent();
    this.props.getAllTSouvenirItemDetil();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      formdata: newProps.tsouveniritemtest,
      souvenir: newProps.souvenirReducer.souvenirs,
      eventcode: newProps.teventReducer.myEvent,
      dataItem: newProps.getAllItem,
      status: newProps.tsouveniritemReducer.statusPUT,
      userdata: newProps.auth.user
    });
  }

  submitHandler() {
    let newItem = this.state.shareholders.map((content, index) => {
      return {
        m_souvenir_id: content.m_souvenir_id,
        qty: parseInt(content.qty),
        note: content.note,
        created_by: content.created_by,
        created_date: content.created_date,
        updated_by: content.updated_by,
        updated_date: content.updated_date,
        is_delete: false
      };
    });
    let data = {
      souv: this.state.formdata,
      oldFile: this.state.dataItem,
      newFile: newItem
    };
    if (this.state.formdata.t_event_id === "") {
      this.setState({
        alertData: {
          status: true,
          message: "Event Code form must be filled!"
        }
      });
    } else if (this.state.formdata.request_due_date === "") {
      this.setState({
        alertData: {
          status: true,
          message: "Request due date form must be filled!"
        }
      });
    } else if (
      moment(this.state.formdata.request_due_date) <
      moment(this.state.formdata.request_date)
    ) {
      this.setState({
        alertData: {
          status: true,
          message: "Request due date must after request date!"
        }
      });
    } else {
      let error = 0;
      this.state.dataItem.forEach(item => {
        if (item.m_souvenir_id === "") {
          error = 1;
        } else if (item.qty === "") {
          error = 2;
        } else if (this.validateQty(item.qty) === false) {
          error = 3;
        }
      });
      if (error === 1) {
        this.setState({
          alertData: {
            status: true,
            message: "Souvenir item form must be filled!"
          }
        });
      } else if (error === 2) {
        this.setState({
          alertData: {
            status: true,
            message: "Qty item form must be filled!"
          }
        });
      } else if (error === 3) {
        this.setState({
          alertData: {
            status: true,
            message: "Qty input only number!"
          }
        });
      } else {
        let error = 0;
        this.state.shareholders.forEach(item => {
          if (item.m_souvenir_id === "") {
            error = 1;
          } else if (item.qty === "") {
            error = 2;
          } else if (this.validateQty(item.qty) === false) {
            error = 3;
          }
        });
        if (error === 1) {
          this.setState({
            alertData: {
              status: true,
              message: "Souvenir item form must be filled!"
            }
          });
        } else if (error === 2) {
          this.setState({
            alertData: {
              status: true,
              message: "Qty item form must be filled!"
            }
          });
        } else if (error === 3) {
          this.setState({
            alertData: {
              status: true,
              message: "Qty input only number!"
            }
          });
        } else {
          this.props.updateTSouvenirItem(data, this.props.modalStatus);
          this.props.closeModalHandler();
        }
      }
    }
  }

  designStatus = status => {
    switch (status) {
      case 0:
        return "Rejected";
      case 2:
        return "In Progress";
      case 3:
        return "Recieved by Requester";
      case 4:
        return "Settlement";
      case 5:
        return "Approved Settlement";
      case 6:
        return "Close Request";
      default:
        return "Submitted";
    }
  };

  func(input) {
    return input
      .forEach(a => {
        if (a.t_souvenir_id === this.props.tsouveniritem.code) {
          return a;
        }
      })
      .filter(b => b !== undefined);
  }

  changeHandler(e) {
    if (
      e.target.name === "request_due_date" &&
      moment(e.target.value) < moment().subtract(1, "day")
    ) {
      this.setState({
        invalid: true
      });
    } else {
      this.setState({
        invalid: false
      });
    }
    let tmp = this.state.formdata;
    tmp[e.target.name] = e.target.value;
    this.setState({
      formdata: tmp
    });
  }

  validateQty(qty) {
    let regex = new RegExp(/^[0-9-]/);
    return regex.test(qty);
  }

  oldFileMap() {
    let tmp = this.state.dataItem.map((item, idx) => {
      return {
        m_souvenir_id: item.m_souvenir_id,
        qty: item.qty,
        note: item.note,
        created_by: item.created_by,
        created_date: item.created_date,
        t_souvenir_id: item.t_souvenir_id,
        disable: true,
        readonly: true
      };
    });
    this.setState({ oldFile: tmp });
  }

  handleShareholderNameChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, [evt.target.name]: evt.target.value };
    });

    this.setState({ shareholders: newShareholders });
  };

  handleSubmit = evt => {
    const { item, shareholders } = this.state;
    alert(`Incorporated: ${item} with ${shareholders.length} shareholders`);
  };

  handleAddShareholder = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([
        {
          m_souvenir_id: "",
          qty: "",
          note: "",
          created_by: this.state.userdata.m_employee_id,
          created_date: moment().format("YYYY-MM-DD"),
          updated_by: this.state.userdata.m_employee_id,
          updated_date: moment().format("YYYY-MM-DD"),
          is_delete: false,
          disable: true,
          readonly: true
        }
      ])
    });
  };

  handleRemoveShareholder = idx => () => {
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx)
    });
  };

  handleEditButtonShareholder = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return {
        ...shareholder,
        readonly: !shareholder.readonly,
        disable: !shareholder.disable
      };
    });
    this.setState({ shareholders: newShareholders });
  };

  handleOldFileItemChange = idx => evt => {
    const newShareholders = this.state.dataItem.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, [evt.target.name]: evt.target.value };
    });

    this.setState({ dataItem: newShareholders });
  };

  handleEditOldFile = idx => evt => {
    const newOldFile = this.state.shareholders.map((item, sidx) => {
      if (idx !== sidx) return item;
      return { ...item, readonly: !item.readonly, disable: !item.disable };
    });
    this.setState({ oldFile: newOldFile });
  };

  handleRemoveOldFile = idx => () => {
    this.setState({
      dataItem: this.state.dataItem.filter((s, sidx) => idx !== sidx)
    });
  };

  render() {
    return (
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader>
          {" "}
          Edit Souvernir Request - {this.state.formdata.code}
        </ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="*Transaction Code"
              type="text"
              name="code"
              placeholder="Auto Generate"
              value={this.state.formdata.code}
              disabled={true}
            />
            <TextFieldGroup
              label="*Event Code"
              type="text"
              name="t_event_id"
              placeholder="Auto Generate"
              value={this.state.formdata.t_event_id}
              disabled={true}
            />
            <TextFieldGroup
              label="*Request By"
              type="text"
              name="request_by"
              placeholder={this.state.formdata.request_by}
              value={this.state.formdata.request_by}
              onChange={this.changeHandler}
              disabled={true}
            />
            <TextFieldGroup
              label="*Request Date"
              type="date"
              name="request_date"
              placeholder={this.state.request_date}
              value={this.state.formdata.request_date}
              onChange={this.changeHandler}
              disabled={true}
            />
            <TextFieldGroup
              label="*Request Due Date"
              type="date"
              name="request_due_date"
              placeholder=""
              value={this.state.formdata.request_due_date}
              onChange={this.changeHandler}
              errors={this.state.errorRequestDueDate}
            />
            <TextAreaGroup
              label="*Note"
              type="text"
              name="note"
              placeholder=""
              value={this.state.formdata.note}
              onChange={this.changeHandler}
            />
            <TextFieldGroup
              label="Status"
              type="text"
              name="status"
              placeholder=""
              value={this.designStatus(this.state.formdata.status)}
              onChange={this.changeHandler}
              disabled={true}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={this.handleAddShareholder}
            >
              Add Item
            </button>
          </form>
          <form>
            {this.state.dataItem === undefined ? (
              <div>Item Not Found</div>
            ) : (
              <Table>
                <Row>
                  <Col md={5}>
                    <Label>
                      <b>Souvenir Item</b>
                    </Label>
                  </Col>
                  <Col md={2}>
                    <Label>
                      <b>Qty</b>
                    </Label>
                  </Col>
                  <Col md={2}>
                    <Label>
                      <b>Note</b>
                    </Label>
                  </Col>
                </Row>
                {this.state.dataItem.map((shareholder, idx) => (
                  <div className="shareholder">
                    <Row form>
                      <Col md={5}>
                        <FormGroup>
                          <select
                            name="m_souvenir_id"
                            id="m_souvenir_id"
                            class="form-control"
                            disabled={this.state.oldFile.disable}
                            value={shareholder.m_souvenir_id}
                            onChange={this.handleOldFileItemChange(idx)}
                          >
                            {this.state.souvenir.map(row => (
                              <option value={row.code}>{row.name}</option>
                            ))}
                            <option value="" disabled>
                              {" "}
                              -{" "}
                            </option>
                          </select>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="qty"
                            id="exampleQty"
                            class="form-control"
                            readOnly={this.state.oldFile.readonly}
                            value={shareholder.qty}
                            onChange={this.handleOldFileItemChange(idx)}
                            placeholder="Qty"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="note"
                            id="exampleNote"
                            class="form-control"
                            readOnly={this.state.oldFile.readonly}
                            value={shareholder.note}
                            onChange={this.handleOldFileItemChange(idx)}
                            placeholder="Note"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <CreateOutlinedIcon
                          size="small"
                          onClick={this.handleEditOldFile(idx)}
                          class="fa fa-trash"
                        />
                      </Col>
                      <Col md={1}>
                        <DeleteOutlinedIcon
                          size="small"
                          onClick={this.handleRemoveOldFile(idx)}
                          class="fa fa-trash"
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
                {this.state.shareholders.map((shareholder, idx) => (
                  <div className="shareholder">
                    <Row form>
                      <Col md={5}>
                        <FormGroup>
                          <select
                            name="m_souvenir_id"
                            id="m_souvenir_id"
                            class="form-control"
                            disabled={shareholder.disable}
                            value={shareholder.m_souvenir_id}
                            onChange={this.handleShareholderNameChange(idx)}
                            placeholder="Souvenir Item"
                          >
                            {this.state.souvenir.map(row => (
                              <option value={row.code}>{row.name}</option>
                            ))}
                            <option value="" disabled>
                              {" "}
                              -{" "}
                            </option>
                          </select>
                        </FormGroup>
                      </Col>
                      <Col md={2}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="qty"
                            id="exampleQty"
                            class="form-control"
                            readOnly={shareholder.readonly}
                            value={shareholder.qty}
                            onChange={this.handleShareholderNameChange(idx)}
                            placeholder="Qty"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="note"
                            id="exampleNote"
                            class="form-control"
                            readOnly={shareholder.readonly}
                            value={shareholder.note}
                            onChange={this.handleShareholderNameChange(idx)}
                            placeholder="Note"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={1}>
                        <CreateOutlinedIcon
                          size="small"
                          onClick={this.handleEditButtonShareholder(idx)}
                          class="fa fa-trash"
                        />
                      </Col>
                      <Col md={1}>
                        <DeleteOutlinedIcon
                          size="small"
                          onClick={this.handleRemoveShareholder(idx)}
                          class="fa fa-trash"
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
              </Table>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status === true ? (
            <Alert color="danger">{this.state.alertData.message} </Alert>
          ) : (
            ""
          )}
          <Button color="primary" onClick={this.submitHandler}>
            Update
          </Button>
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

EditTsouveniritem.propTypes = {
  classes: PropTypes.object.isRequired,
  EditTsouveniritem: PropTypes.func.isRequired,
  getAllSouvenir: PropTypes.func.isRequired,
  getEvent: PropTypes.func.isRequired,
  updateTSouvenirItem: PropTypes.func.isRequired,
  tsouveniritemReducer: PropTypes.object.isRequired,
  souvenir: PropTypes.object.isRequired,
  tevent: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemReducer: state.tsouveniritemIndexReducer,
  souvenirReducer: state.souvenir,
  teventReducer: state.event,
  tsouveniritemviewReducer: state.tsouveniritemIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    EditTsouveniritem,
    getAllSouvenir,
    getEvent,
    getAllTSouvenirItemDetil,
    updateTSouvenirItem
  }
)(EditTsouveniritem);
