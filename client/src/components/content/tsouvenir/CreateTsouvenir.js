import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  Col,
  Row,
  FormGroup,
  Label,
  Input,
  Button
  // FormFeedback,
  // Form
} from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createTsouvenir } from "../../../actions/tsouvenirAction";
import { getAllSouvenir } from "../../../actions/souvenirAction";
import { getAllEmployee } from "../../../actions/tsouvenirAction";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
import SelectList from "../../common/SelectListGroup";
import isEmpty from "../../../validation/isEmpty";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import moment from "moment";

class CreateTsouvenir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      received_by: "",
      received_date: "",
      note: "",
      item: [],
      alertData: {
        status: false,
        message: ""
      },
      labelWidth: 0,
      selectedOption: "",
      selectedOption2: "",
      employee: [],
      souvenirs: [],
      userdata: {},
      invalidReceivedDate: false
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentDidMount() {
    this.props.getAllSouvenir();
    this.props.getAllEmployee();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      souvenirs: newProps.souvenirReducer.souvenirs,
      employee: newProps.employeeReducer.myEmployee,
      status: newProps.tsouvenirReducer.statusADD,
      userdata: newProps.auth.user
    });
  }

  changeHandler(e) {
    if (
      e.target.name === "received_date" &&
      moment(e.target.value) < moment().subtract(1, "day")
    ) {
      this.setState({
        invalidReceivedDate: true
      });
    } else {
      this.setState({
        invalidReceivedDate: false
      });
    }
    if (e.target.name === "recieved_by") {
      this.setState({ errorReceivedBy: "" });
    }
    if (e.target.name === "received_date") {
      this.setState({ errorReceivedDate: "" });
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleShareholderItemChange = idx => evt => {
    const newShareholders = this.state.item.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, [evt.target.name]: evt.target.value };
    });

    this.setState({ item: newShareholders });
  };

  handleSubmit = evt => {
    const { item, shareholders } = this.state;
    alert(`Incorporated: ${item} with ${shareholders.length} shareholders`);
  };

  handleAddItem = () => {
    this.setState({
      item: this.state.item.concat([
        {
          m_souvenir_id: "",
          qty: "",
          note: "",
          created_by: this.state.userdata.m_employee_id,
          disable: true,
          readOnly: true
        }
      ])
    });
  };

  handleRemoveItem = idx => () => {
    this.setState({
      item: this.state.item.filter((s, sidx) => idx !== sidx)
    });
  };

  handleEditItem = idx => () => {
    const newShareholders = this.state.item.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return {
        ...shareholder,
        disable: !shareholder.disable,
        readOnly: !shareholder.readOnly
      };
    });

    this.setState({ item: newShareholders });
  };

  handleChange1 = selectedOption => {
    this.setState({
      selectedOption,
      received_by: selectedOption.value
    });
  };

  handleChange2 = selectedOption2 => {
    this.setState({
      selectedOption2,
      shareholder: selectedOption2.value
    });
  };

  validateQty(qty) {
    let regex = new RegExp(/[0-9-]/);
    return regex.test(qty);
  }

  submitHandler() {
    const formdata = {
      code: this.state.code,
      received_by: this.state.received_by,
      received_date: this.state.received_date,
      note: this.state.note,
      created_by: this.state.userdata.m_employee_id
    };

    let dataItem = this.state.item.map((content, index) => {
      return {
        m_souvenir_id: content.m_souvenir_id,
        qty: parseInt(content.qty),
        note: content.note,
        created_by: content.created_by,
        created_date: content.created_date,
        is_delete: false
      };
    });

    if (isEmpty(this.state.received_by)) {
      this.setState({ errorReceivedBy: "This Field is Required" });
    } else if (isEmpty(this.state.received_date)) {
      this.setState({ errorReceivedBy: "This Field is Required" });
    } else if (moment(this.state.received_date) < moment().subtract(1, "day")) {
      alert("Pilih Tnaggal Baru");
    } else {
      let error = 0;
      let sama = false;
      this.state.item.forEach((item, index) => {
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
        for (i = 0; i <= this.state.item.length - 1; i++) {
          for (j = 0; j <= this.state.item.length - 1; j++) {
            if (i === j) {
              error = 0;
            } else {
              if (
                this.state.item[i].m_souvenir_id ===
                this.state.item[j].m_souvenir_id
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
          let datas = [formdata, dataItem];
          this.props.createTsouvenir(datas);
          this.props.closeHandler();
        }
      }
    }
  }

  render() {
    const options1 = [];
    options1.push({ label: "*Select Received By", value: "" });
    this.state.employee.forEach(row => {
      options1.push({
        value: row.employee_number,
        label: row.first_name + " " + row.last_name
      });
    });
    const options2 = [];
    this.state.souvenirs.forEach(row => {
      options2.push({
        value: row.code,
        label: row.name
      });
    });
    return (
      <Modal isOpen={this.props.create} className={this.props.className}>
        <ModalHeader> Add Souvenir</ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="*Transaction Code"
              placeholder="Auto Generated"
              name="code"
              disabled={true}
            />
            <SelectList
              label="*Received By"
              placeholder="*Select Received By"
              name="received_by"
              value={this.state.selectedOption}
              onChange={this.handleChange1}
              options={options1}
              errors={this.state.errorReceivedBy}
            />
            <TextFieldGroup
              label="*Received Date"
              type="date"
              placeholder="Type Received Date"
              name="received_date"
              value={this.state.received_date}
              onChange={this.changeHandler}
              errors={this.state.errorReceivedDate}
            />
            {/* <Form horizontal>
              <FormGroup controlId="formHorizontalReceivedDate">
                <Col sm={4}>Received date</Col>
                <Col sm={8}>
                  <Input
                    type="date"
                    name="received_date"
                    placeholder=""
                    value={this.state.received_date}
                    onChange={this.changeHandler}
                    invalid={this.state.invalidReceivedDate}
                  />
                  <FormFeedback invalid={this.state.invalidReceivedDate}>
                    Received date must be today or onwards.
                  </FormFeedback>
                </Col>
              </FormGroup>
            </Form> */}
            <TextAreaGroup
              label="Notes"
              placeholder="Type Notes"
              name="note"
              value={this.state.note}
              onChange={this.changeHandler}
            />
          </form>
          {/*<FormGroup>
            <Label for="">Code</Label>
            <Input
              type="text"
              name="code"
              placeholder="Auto Generate"
              readOnly
            />
          </FormGroup>
          <formControl variant="outlined">
            <Label for="">Received By</Label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange1}
              options={options1}
            />
          </formControl>
          <FormGroup>
            <Label for="">Received date</Label>
            <Input
              type="date"
              name="received_date"
              placeholder=""
              value={this.state.received_date}
              onChange={this.changeHandler}
              invalid={this.state.invalid}
            />
            <FormFeedback invalid={this.state.invalid}>
              Oh noes! that date is already taken
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
          </FormGroup> */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleAddItem}
          >
            Add Item
          </Button>
          <br />
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
          {this.state.item.map((shareholder, idx) => (
            <div className="shareholder">
              <Row form>
                <Col md={5}>
                  <FormGroup>
                    <select
                      name="m_souvenir_id"
                      id="m_souvenir_id"
                      class="form-control"
                      value={shareholder.m_souvenir_id}
                      onChange={this.handleShareholderItemChange(idx)}
                      disabled={shareholder.disable}
                    >
                      {this.state.souvenirs.map(row => (
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
                      onChange={this.handleShareholderItemChange(idx)}
                      value={shareholder.qty}
                      readOnly={shareholder.readOnly}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Input
                      type="text"
                      name="note"
                      id="exampleNote"
                      onChange={this.handleShareholderItemChange(idx)}
                      readOnly={shareholder.readOnly}
                    />
                  </FormGroup>
                </Col>
                <Col md={1}>
                  <CreateOutlinedIcon
                    onClick={this.handleEditItem(idx)}
                    size="small"
                  />
                </Col>
                <Col md={1}>
                  <DeleteOutlinedIcon
                    onClick={this.handleRemoveItem(idx)}
                    size="small"
                  />
                </Col>
              </Row>
            </div>
          ))}
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
          <Button
            color="warning"
            variant="contained"
            onClick={this.props.closeHandler}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateTsouvenir.propTypes = {
  createTsouveniritem: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  createTsouvenir: PropTypes.func.isRequired,
  getAllSouvenir: PropTypes.func.isRequired,
  tsouveniritem: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  souvenirReducer: state.souvenir,
  employeeReducer: state.employee,
  tsouvenirReducer: state.tsouvenirIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    createTsouvenir,
    getAllSouvenir,
    getAllEmployee
  }
)(CreateTsouvenir);
