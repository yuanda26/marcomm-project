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
  Table,
  Row,
  Col,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { getAllSouvenir } from "../../../actions/souvenirAction";
import { getAllEmployee } from "../../../actions/tsouvenirAction";
import { updateTsouvenir } from "../../../actions/tsouvenirAction";

class EditTsouvenir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formdata: {
        code: "",
        received_by: "",
        received_date: "",
        note: "",
        created_by: "",
        updated_by: ""
      },
      alertData: {
        status: false,
        message: ""
      },
      dataItem: this.props.getAllItem,
      result: [],
      item: [],
      sov: [],
      employee: [],
      souv: "",
      oldFile: "",
      newFile: "",
      status: ""
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
      formdata: newProps.tsouvenirTest,
      sov: newProps.souvenirReducer.souvenirs,
      employee: newProps.employeeReducer.myEmployee,
      dataItem: newProps.getAllItem,
      status: newProps.tsouvenirReducer.statusPUT
    });
  }

  handleOldFileItemChange = idx => evt => {
    const newShareholders = this.state.dataItem.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, [evt.target.name]: evt.target.value };
    });

    this.setState({ dataItem: newShareholders });
  };

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

  handleRemoveOldFile = idx => () => {
    this.setState({
      dataItem: this.state.dataItem.filter((s, sidx) => idx !== sidx)
    });
  };

  changeHandler(e) {
    let tmp = this.state.formdata;
    tmp[e.target.name] = e.target.value;
    this.setState({
      formdata: tmp
    });
  }

  submitHandler() {
    let result = this.state.item.map((content, index) => {
      return {
        m_souvenir_id: content.m_souvenir_id,
        qty: parseInt(content.qty),
        note: content.note,
        created_by: content.created_by,
        created_date: content.created_date,
        is_delete: false
      };
    });
    const validate = (header, body, footer) => {
      const validateHeader = input => {
        if (input.received_date === "") return false;
        else return true;
      };
      const validateBody = input => {
        let reg = /^[1234567890]+$/;
        let data = input
          .map(content => {
            if (content.m_souvenir_id === "" || !reg.test(content.qty)) {
              return false;
            }
            return true;
          })
          .filter(a => a !== true);
        if (data.length === 0) {
          return true;
        } else return false;
      };
      const validateFooter = input => {
        if (input.length === 0) {
          return true;
        } else {
          let reg = /^[1234567890]+$/;
          let data = input
            .map(content => {
              if (content.m_souvenir_id === "" || !reg.test(content.qty)) {
                return false;
              }
              return true;
            })
            .filter(a => a !== true);
          if (data.length === 0) {
            return true;
          } else return false;
        }
      };
      if (
        validateHeader(header) &&
        validateBody(body) &&
        validateFooter(footer)
      ) {
        return true;
      } else return false;
    };
    if (validate(this.state.formdata, this.state.dataItem, this.state.item)) {
      let data = {
        souv: this.state.formdata,
        oldFile: this.state.dataItem,
        newFile: result
      };
      this.props.updateTsouvenir(data);
      this.props.closeModalHandler();
    } else {
      setTimeout(() => {
        this.setState({
          alertData: {
            status: false,
            message: "Data Item not correct"
          }
        });
      }, 2000);
      this.setState({
        alertData: {
          status: true,
          message: "Data Item not correct"
        }
      });
    }
  }

  render() {
    this.state.status === 200 &&
      this.props.modalStatus(1, "Updated", this.state.formdata.code);
    return (
      <Modal isOpen={this.props.edit} className={this.props.className}>
        <ModalHeader> Edit Souvenir Stock</ModalHeader>
        <ModalBody>
          <form>
            <FormGroup>
              <Label for="">Code</Label>
              <Input
                type="text"
                name="code"
                placeholder="Auto Denerate"
                value={this.state.formdata.code}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <select
                name="received_by"
                id="received_by"
                class="form-control"
                value={this.state.formdata.received_by}
                onChange={this.changeHandler}
              >
                {this.state.employee.map(row => (
                  <option value={row.employee_number}>
                    {row.first_name + " " + row.last_name}
                  </option>
                ))}
                <option value="" disabled>
                  {" "}
                  -{" "}
                </option>
              </select>
            </FormGroup>
            <FormGroup>
              <Label for="">Received date</Label>
              <Input
                type="date"
                name="received_date"
                placeholder=""
                value={this.state.formdata.received_date}
                onChange={this.changeHandler}
              />
            </FormGroup>
            <FormGroup>
              <Label for="">Note</Label>
              <Input
                type="textarea"
                name="note"
                placeholder=""
                value={this.state.formdata.note}
                onChange={this.changeHandler}
              />
            </FormGroup>
          </form>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleAddItem}
          >
            Add Item
          </Button>
          <br />
          {this.state.dataItem.length === 0 ? (
            <div>poo</div>
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
              {this.state.dataItem.map((content, idx) => (
                <div className="content">
                  <Row form>
                    <Col md={5}>
                      <FormGroup>
                        {/* <Label for="m_souvenir_id">Souvenir Item</Label> */}
                        <select
                          name="m_souvenir_id"
                          id="m_souvenir_id"
                          class="form-control"
                          value={content.m_souvenir_id}
                          onChange={this.handleOldFileItemChange(idx)}
                        >
                          {this.state.sov.map(row => (
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
                          class="form-control"
                          value={content.qty}
                          onChange={this.handleOldFileItemChange(idx)}
                          placeholder="Qty"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        {/* <Label for="exampleNote">Note</Label> */}
                        <Input
                          type="text"
                          name="note"
                          id="exampleNote"
                          class="form-control"
                          value={content.note}
                          onChange={this.handleOldFileItemChange(idx)}
                          placeholder="Note"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={1}>
                      {/* <Label for="exampleNote">Edit</Label> */}
                      <CreateOutlinedIcon size="small" class="fa fa-trash" />
                    </Col>
                    <Col md={1}>
                      {/* <Label for="exampleNote">Delete</Label> */}
                      <DeleteOutlinedIcon
                        size="small"
                        onClick={this.handleRemoveOldFile(idx)}
                        class="fa fa-trash"
                      />
                    </Col>
                  </Row>
                </div>
              ))}
              {this.state.item.map((shareholder, idx) => (
                <div className="shareholder">
                  <Row form>
                    <Col md={5}>
                      <FormGroup>
                        {/* <Label for="m_souvenir_id">Souvenir Item</Label> */}
                        <select
                          name="m_souvenir_id"
                          id="m_souvenir_id"
                          class="form-control"
                          value={shareholder.m_souvenir_id}
                          disabled={shareholder.disable}
                          onChange={this.handleShareholderItemChange(idx)}
                          placeholder="Souvenir Item"
                        >
                          {this.state.sov.map(row => (
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
                          class="form-control"
                          value={shareholder.qty}
                          onChange={this.handleShareholderItemChange(idx)}
                          placeholder="Qty"
                          readOnly={shareholder.readOnly}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        {/* <Label for="exampleNote">Note</Label> */}
                        <Input
                          type="text"
                          name="note"
                          id="exampleNote"
                          class="form-control"
                          value={shareholder.note}
                          onChange={this.handleShareholderItemChange(idx)}
                          placeholder="Note"
                          readOnly={shareholder.readOnly}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={1}>
                      {/* <Label for="exampleNote">Edit</Label> */}
                      <CreateOutlinedIcon
                        onClick={this.handleEditItem(idx)}
                        size="small"
                      />
                    </Col>
                    <Col md={1}>
                      {/* <Label for="exampleNote">Delete</Label> */}
                      <DeleteOutlinedIcon
                        size="small"
                        onClick={this.handleRemoveItem(idx)}
                        class="fa fa-trash"
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </Table>
          )}
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

EditTsouvenir.propTypes = {
  classes: PropTypes.object.isRequired,
  employeeReducer: PropTypes.object.isRequired,
  souvenirReducer: PropTypes.object.isRequired,
  tsouvenirReducer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  souvenirReducer: state.souvenir,
  tsouvenirReducer: state.tsouvenirIndexReducer,
  employeeReducer: state.employee
});

export default connect(
  mapStateToProps,
  {
    getAllSouvenir,
    getAllEmployee,
    updateTsouvenir
  }
)(EditTsouvenir);
