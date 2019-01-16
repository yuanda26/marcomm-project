import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Create, Delete } from "@material-ui/icons";
import { getAllSouvenir } from "../../../actions/souvenirAction";
import { getAllEmployee } from "../../../actions/tsouvenirAction";
import { updateTsouvenir } from "../../../actions/tsouvenirAction";
import TextField from "../../common/TextField";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
import SelectListGroup from "../../common/SelectListGroup";
import SelectList from "../../common/SelectList";
import Spinner from "../../common/Spinner";

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
      oldItem: this.props.getAllItem,
      newItem: [],
      employee: [],
      souv: "",
      oldFile: "",
      newFile: "",
      status: "",
      souvenirOptions: []
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
      employee: newProps.employeeReducer.myEmployee,
      oldItem: newProps.getAllItem,
      status: newProps.tsouvenirReducer.statusPUT,
      souvenirOptions: [{ label: "*Select Souvenir", value: "" }].concat(
        newProps.souvenirReducer.souvenirs.map(row => ({
          label: row.name,
          value: row.code
        }))
      )
    });
  }

  handleOldItemChange = idx => evt => {
    const newOldItem = this.state.oldItem.map((oldItem, sidx) => {
      if (idx !== sidx) return oldItem;
      return { ...oldItem, [evt.target.name]: evt.target.value };
    });

    this.setState({ oldItem: newOldItem });
  };

  handleRemoveOldItem = idx => () => {
    this.setState({
      oldItem: this.state.oldItem.filter((s, sidx) => idx !== sidx)
    });
  };

  handleSubmit = evt => {
    const { newItem, shareholders } = this.state;
    alert(`Incorporated: ${newItem} with ${shareholders.length} shareholders`);
  };

  handleAddNewItem = () => {
    this.setState({
      newItem: this.state.newItem.concat([
        {
          m_souvenir_id: "",
          qty: "",
          note: "",
          disable: true,
          readOnly: true,
          errorSouvenir: "",
          errorQty: ""
        }
      ])
    });
  };

  handleAddedItemChange = idx => evt => {
    const newAddedItem = this.state.newItem.map((newItem, sidx) => {
      if (idx !== sidx) return newItem;
      return { ...newItem, [evt.target.name]: evt.target.value };
    });

    this.setState({ newItem: newAddedItem });
  };

  handleEditNewItem = idx => () => {
    const newShareholders = this.state.newItem.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return {
        ...shareholder,
        disable: !shareholder.disable,
        readOnly: !shareholder.readOnly
      };
    });

    this.setState({ newItem: newShareholders });
  };

  handleRemoveNewItem = idx => () => {
    this.setState({
      newItem: this.state.newItem.filter((s, sidx) => idx !== sidx)
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
    let newItem = this.state.newItem.map((content, index) => {
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
    if (validate(this.state.formdata, this.state.oldItem, this.state.newItem)) {
      let data = {
        souv: this.state.formdata,
        oldFile: this.state.oldItem,
        newFile: newItem
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
    const employeeOptions = [];
    employeeOptions.push({ label: "*Select Received By", value: "" });
    this.state.employee.forEach(row => {
      employeeOptions.push({
        value: row.employee_number,
        label: row.first_name + " " + row.last_name
      });
    });

    this.state.status === 200 &&
      this.props.modalStatus(1, "Updated", this.state.formdata.code);
    return (
      <Modal
        isOpen={this.props.edit}
        className={this.props.className}
        size="lg"
      >
        <ModalHeader> Edit Souvenir Stock</ModalHeader>
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
            <SelectListGroup
              label="*Received By"
              name="received_by"
              id="received_by"
              class="form-control"
              value={this.state.formdata.received_by}
              onChange={this.changeHandler}
              options={employeeOptions}
              errors={this.state.errorReceivedBy}
            />
            <TextFieldGroup
              label="*Received Date"
              type="date"
              name="received_date"
              placeholder=""
              value={this.state.formdata.received_date}
              onChange={this.changeHandler}
              errors={this.state.errorReceivedDate}
            />
            <TextAreaGroup
              label="Note"
              type="textarea"
              name="note"
              placeholder=""
              value={this.state.formdata.note}
              onChange={this.changeHandler}
              maxLength="255"
            />
          </form>
          <div className="col-md-12 mb-4 form-inline">
            <button
              className="btn btn-primary"
              type="button"
              onClick={this.handleAddNewItem}
            >
              Add Item
            </button>
            <br />
            {this.state.oldItem.length === 0 ? (
              <Spinner />
            ) : (
              <table className="table table-responsive mt-2 mb-2">
                <thead>
                  <tr className="text-center">
                    <th>Souvenir</th>
                    <th>Qty</th>
                    <th>Note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.oldItem.map((oldItem, idx) => (
                    <tr key={idx}>
                      <td>
                        <SelectList
                          type="text"
                          name="m_souvenir_id"
                          placeholder="*Souvenir Item"
                          value={oldItem.m_souvenir_id}
                          onChange={this.handleOldItemChange(idx)}
                          options={this.state.souvenirOptions}
                          errors={oldItem.errorSouvenir}
                        />
                      </td>
                      <td>
                        <TextField
                          type="number"
                          name="qty"
                          placeholder="*Qty"
                          value={oldItem.qty}
                          onChange={this.handleOldItemChange(idx)}
                          errors={oldItem.errorQty}
                        />
                      </td>
                      <td>
                        <TextField
                          type="text"
                          name="note"
                          id="exampleNote"
                          class="form-control"
                          value={oldItem.note}
                          onChange={this.handleOldItemChange(idx)}
                          placeholder="Note"
                        />
                      </td>
                      <td>
                        <Create
                          className="mr-1"
                          onClick={this.handleEditNewItem(idx)}
                          size="small"
                        />
                        <Delete
                          onClick={this.handleRemoveOldItem(idx)}
                          size="small"
                        />
                      </td>
                    </tr>
                  ))}
                  {this.state.newItem.map((newItem, idx) => (
                    <tr>
                      <td>
                        <SelectList
                          type="text"
                          name="m_souvenir_id"
                          className="form-control"
                          placeholder="*Souvenir Item"
                          value={newItem.m_souvenir_id}
                          disabled={newItem.disable}
                          onChange={this.handleAddedItemChange(idx)}
                          options={this.state.souvenirOptions}
                        />
                      </td>
                      <td>
                        <TextField
                          type="number"
                          name="qty"
                          className="form-control"
                          value={newItem.qty}
                          onChange={this.handleAddedItemChange(idx)}
                          placeholder="*Qty"
                          readOnly={newItem.readOnly}
                        />
                      </td>
                      <td>
                        <TextField
                          type="text"
                          name="note"
                          className="form-control"
                          value={newItem.note}
                          onChange={this.handleAddedItemChange(idx)}
                          placeholder="Note"
                          readOnly={newItem.readOnly}
                        />
                      </td>
                      <td>
                        <Create
                          className="mr-1"
                          onClick={this.handleEditNewItem(idx)}
                          size="small"
                        />
                        <Delete
                          size="small"
                          onClick={this.handleRemoveNewItem(idx)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          {this.state.alertData.status === true && (
            <Alert color="danger">{this.state.alertData.message} </Alert>
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
