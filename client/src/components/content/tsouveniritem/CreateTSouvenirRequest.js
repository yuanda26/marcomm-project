import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button } from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Delete, Create } from "@material-ui/icons";
import {
  createTSouvenirItem,
  getEvent
} from "../../../actions/tsouveniritemAction";
import { getAllSouvenir } from "../../../actions/souvenirAction";
import moment from "moment";
import SelectList from "../../common/SelectList";
import SelectListGroup from "../../common/SelectListGroup";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";

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
      event_code: "",
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
    // if (
    //   e.target.name === "due_date" &&
    //   moment(e.target.value) < moment().subtract(1, "day")
    // ) {
    //   this.setState({
    //     invalid: true
    //   });
    // } else {
    //   this.setState({
    //     invalid: false
    //   });
    // }
    this.setState({
      [e.target.name]: e.target.value,
      alertData: {
        status: false,
        message: ""
      }
    });
  }

  handleShareholderItemChange = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, [evt.target.name]: evt.target.value };
    });

    this.setState({ shareholders: newShareholders });
  };

  handleAddItem = () => {
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
      t_event_id: this.state.event_code,
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
          this.props.createTSouvenirItem(datas, this.props.modalStatus);
          this.props.closeHandler();
        }
      }
    }
  }

  handleRemoveModal = () => {
    this.setState({ deleteModal: true });
  };

  closeModal = () => {
    this.setState({
      deleteModal: false
    });
  };

  render() {
    const EventOptions = [];
    EventOptions.push({ label: "Select Event Code", value: "" });
    this.state.eventcode.forEach(row => {
      EventOptions.push({
        value: row.code,
        label: row.event_name
      });
    });

    const SouvenirOptions = [];
    SouvenirOptions.push({ label: "Select Souvenir", value: "" });
    this.state.souvenir.forEach(row => {
      SouvenirOptions.push({
        value: row.code,
        label: row.name
      });
    });

    // display and undisplay table design item form
    // based on items state length
    const display =
      this.state.shareholders.length === 0 ? "none" : "table-row-group";
    const style = {
      display: display
    };

    return (
      <Modal
        isOpen={this.props.create}
        className={this.props.className}
        size="lg"
      >
        <ModalHeader> Add Souvenir Request </ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="*Transaction Code"
              placeholder="Auto Generated"
              name="code"
              disabled={true}
            />
            <SelectListGroup
              label="*Event Code"
              placeholder="*Select Event Code"
              name="event_code"
              value={this.state.event_code}
              onChange={this.changeHandler}
              options={EventOptions}
              errors={this.state.errorEventCode}
            />
            <TextFieldGroup
              label="*Request By"
              placeholder={this.state.userdata.m_employee_id}
              name="request_by"
              value={this.state.userdata.m_employee_id}
              onChange={this.changeHandler}
              errors={this.state.errorEventCode}
              disabled={true}
            />
            <TextFieldGroup
              label="*Request Date"
              type="date"
              placeholder="Type Request Date"
              name="request_date"
              value={this.state.request_date}
              onChange={this.changeHandler}
              errors={this.state.errorRequestDate}
            />
            <TextFieldGroup
              label="*Request Due Date"
              type="date"
              placeholder="Type Request Due Date"
              name="due_date"
              value={this.state.request_due_date}
              onChange={this.changeHandler}
              errors={this.state.errorRequestDueDate}
            />
            <TextAreaGroup
              label="Notes"
              placeholder="Type Notes"
              name="note"
              value={this.state.note}
              onChange={this.changeHandler}
              maxLength="255"
            />
          </form>
          <div className="col-md-12 mb-4 form-inline">
            <button
              className="btn btn-primary"
              type="button"
              onClick={this.handleAddItem}
            >
              Add Item
            </button>

            <table className="table table-responsive mt-2 mb-2">
              <thead style={style}>
                <tr className="text-center">
                  <th>Souvenir</th>
                  <th>Qty</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.shareholders.map((shareholder, idx) => (
                  <tr>
                    <td>
                      <SelectList
                        name="m_souvenir_id"
                        value={shareholder.m_souvenir_id}
                        onChange={this.handleShareholderItemChange(idx)}
                        disabled={shareholder.disable}
                        options={SouvenirOptions}
                        errors={shareholder.errorSouvenir}
                      />
                    </td>
                    <td>
                      <TextFieldGroup
                        type="number"
                        name="qty"
                        onChange={this.handleShareholderItemChange(idx)}
                        value={shareholder.qty}
                        errors={shareholder.errorQty}
                        disabled={shareholder.disable}
                      />
                    </td>
                    <td>
                      <TextFieldGroup
                        type="text"
                        name="note"
                        onChange={this.handleShareholderItemChange(idx)}
                        value={shareholder.note}
                        readOnly={shareholder.readOnly}
                        disabled={shareholder.disable}
                      />
                    </td>
                    <td>
                      <Create
                        className="mr-1"
                        onClick={this.handleEditButtonShareholder(idx)}
                        size="small"
                      />
                      <Delete onClick={this.handleRemoveModal} size="small" />
                      {/* Delete Design Items Modal */}
                      <Modal isOpen={this.state.deleteModal}>
                        <ModalHeader>
                          <div className="lead">Delete Item?</div>
                        </ModalHeader>
                        <ModalBody>
                          <form>
                            <div className="form-group text-right">
                              <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={this.handleRemoveShareholder(idx)}
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                className="btn btn-default"
                                onClick={this.closeModal}
                              >
                                Close
                              </button>
                            </div>
                          </form>
                        </ModalBody>
                      </Modal>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status === true && (
            <Alert color="danger">{this.state.alertData.message} </Alert>
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
