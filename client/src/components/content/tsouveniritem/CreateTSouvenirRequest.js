import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormFeedback
} from "reactstrap";
import { Col, Row, FormGroup, Label, Input, Button } from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Select from "react-select";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import {
  createTSouvenirItem,
  getEvent
} from "../../../actions/tsouveniritemAction";
import { getAllSouvenir } from "../../../actions/souvenirAction";
import moment from "moment";

class CreateTsouveniritem extends React.Component {
  componentDidMount() {
    this.props.getAllSouvenir();
    this.props.getEvent();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      souvenir: newProps.souvenirReducer.souvenirs,
      eventcode: newProps.teventReducer.myEvent,
      status: newProps.tsouveniritemReducer.statusADD,
      userdata: newProps.auth.user
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      code: "",
      selectedEventCode: "",
      due_date: "",
      note: "",
      shareholders: [],
      alertData: {
        status: false,
        message: ""
      },
      status: "",
      labelWidth: 0,
      selectedEvent: "",
      eventcode: [], //eventcode get from t_event
      souvenir: [], //souvenir get from m_souvenir
      invalid: false,
      userdata: {}
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    if (
      e.target.name === "due_date" &&
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
    this.setState({
      [e.target.name]: e.target.value,
      alertData: {
        status: false,
        message: ""
      }
    });
  }

  handleShareholderNameChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, [evt.target.name]: evt.target.value };
    });

    this.setState({ shareholders: newShareholders });
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
          is_delete: false,
          readonly: true,
          disable: true
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

  handleChange1 = selectedOption => {
    this.setState({
      selectedOption,
      selectedEventCode: selectedOption.value
    });
  };

  handleChange2 = selectedOption2 => {
    this.setState({
      selectedOption2,
      selectedSouvenir: selectedOption2
    });
  };

  validateQty(qty) {
    let regex = new RegExp(/[0-9-]/);
    return regex.test(qty);
  }

  submitHandler() {
    const formdata = {
      code: this.state.code,
      t_event_id: this.state.selectedEventCode,
      request_by: this.state.userdata.m_employee_id,
      request_date: moment().format("YYYY-MM-DD"),
      request_due_date: this.state.due_date,
      status: 1,
      note: this.state.note,
      created_by: this.state.userdata.m_employee_id,
      created_date: moment().format("YYYY-MM-DD")
    };
    let items = this.state.shareholders.map((content, index) => {
      return {
        m_souvenir_id: content.m_souvenir_id,
        qty: parseInt(content.qty),
        note: content.note,
        created_by: content.created_by,
        created_date: content.created_date,
        is_delete: false
      };
    });
    if (formdata.t_event_id === "") {
      this.setState({
        alertData: {
          status: true,
          message: "Event Code form must be filled!"
        }
      });
    } else if (formdata.request_due_date === "") {
      this.setState({
        alertData: {
          status: true,
          message: "Request due date form must be filled!"
        }
      });
    } else if (
      moment(formdata.request_due_date) < moment().subtract(1, "day")
    ) {
      this.setState({
        alertData: {
          status: true,
          message: "Request due date must after request date!"
        }
      });
    } else {
      let error = 0;
      let sama = false;
      this.state.shareholders.forEach((item, index) => {
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
        let i;
        let j;
        for (i = 0; i <= this.state.shareholders.length - 1; i++) {
          for (j = 0; j <= this.state.shareholders.length - 1; j++) {
            if (i === j) {
              error = 0;
            } else {
              if (
                this.state.shareholders[i].m_souvenir_id ===
                this.state.shareholders[j].m_souvenir_id
              ) {
                sama = true;
              } else {
                sama = false;
              }
            }
          }
        }
        if (sama === true) {
          this.setState({
            alertData: {
              status: true,
              message: "Item sudah ditambahkan!"
            }
          });
        } else {
          this.setState({
            alertData: {
              status: false,
              message: ""
            }
          });
          let datas = [formdata, items];
          this.props.createTSouvenirItem(datas);
          this.props.closeHandler();
        }
      }
    }
  }

  render() {
    this.state.status === 200 &&
      this.props.modalStatus(1, "Saved", this.state.code);

    const optionsEvent = [];
    this.state.eventcode.forEach(row => {
      optionsEvent.push({
        value: row.code,
        label: row.event_name
      });
    });

    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader> Add Souvenir Request </ModalHeader>
        <ModalBody>
          {/* <form className={classes.container}> */}
          <form>
            <FormGroup>
              <Label for="">*Transaction Code</Label>
              <Input
                type="text"
                name="code"
                placeholder="Auto Generated"
                readOnly
              />
            </FormGroup>
            <formGroup
              variant="outlined"
              // className={classes.formGroup}
            >
              <Label for="">*Event Code</Label>
              <Select
                value={this.state.selectedOption}
                onChange={this.handleChange1}
                options={optionsEvent}
              />
            </formGroup>
            <FormGroup>
              <Label for="">*Request By</Label>
              <Input
                type="text"
                name="request_by"
                placeholder={this.state.userdata.m_employee_id}
                value={this.state.request_by}
                onChange={this.changeHandler}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">*Request Date</Label>
              <Input
                type="text"
                name="request_date"
                placeholder={moment().format("DD/MM/YYYY")}
                value={this.state.request_date}
                onChange={this.changeHandler}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="">*Due Date</Label>
              <Input
                type="date"
                name="due_date"
                placeholder=""
                value={this.state.due_date}
                onChange={this.changeHandler}
                invalid={this.state.invalid}
              />
              <FormFeedback invalid={this.state.invalid}>
                Due date must after request date.
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="">Note</Label>
              <Input
                type="textarea"
                name="note"
                placeholder=""
                value={this.state.note}
                onChange={this.changeHandler}
              />
            </FormGroup>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.handleAddShareholder}
            >
              Add Item
            </Button>
          </form>
          <form>
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
            {this.state.shareholders.map((shareholder, idx) => (
              <div className="shareholder">
                <Row form>
                  <Col md={5}>
                    <FormGroup>
                      <select
                        name="m_souvenir_id"
                        id="m_souvenir_id"
                        class="form-control"
                        value={shareholder.m_souvenir_id}
                        onChange={this.handleShareholderNameChange(idx)}
                        disabled={shareholder.disable}
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
                      {/* <Label for="exampleQty">Qty</Label> */}
                      <Input
                        type="text"
                        name="qty"
                        id="exampleQty"
                        placeholder="Qty"
                        onChange={this.handleShareholderNameChange(idx)}
                        value={shareholder.qty}
                        readOnly={shareholder.readonly}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      {/* <Label for="exampleNote">Note</Label> */}
                      <Input
                        type="text"
                        name={"note"}
                        id="exampleNote"
                        onChange={this.handleShareholderNameChange(idx)}
                        placeholder="Note"
                        readOnly={shareholder.readonly}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={1}>
                    {/* <Label for="exampleNote">Edit</Label> */}
                    <CreateOutlinedIcon
                      size="small"
                      class="fa fa-trash"
                      onClick={this.handleEditButtonShareholder(idx)}
                    />
                  </Col>
                  <Col md={1}>
                    {/* <Label for="exampleNote">Delete</Label> */}
                    <DeleteOutlinedIcon
                      size="small"
                      onClick={this.handleRemoveShareholder(idx)}
                      class="fa fa-trash"
                    />
                  </Col>
                </Row>
              </div>
            ))}
          </form>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status === true ? (
            <Alert color="danger">{this.state.alertData.message} </Alert>
          ) : (
            ""
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitHandler}
          >
            Save
          </Button>
          <Button variant="contained" onClick={this.props.closeHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateTsouveniritem.propTypes = {
  classes: PropTypes.object.isRequired,
  createTSouvenirItem: PropTypes.func.isRequired,
  getAllSouvenir: PropTypes.func.isRequired,
  getEvent: PropTypes.func.isRequired,
  tsouveniritemReducer: PropTypes.object.isRequired,
  souvenir: PropTypes.object.isRequired,
  tevent: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemReducer: state.tsouveniritemIndexReducer,
  souvenirReducer: state.souvenir,
  teventReducer: state.event,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createTSouvenirItem, getAllSouvenir, getEvent }
)(CreateTsouveniritem);
