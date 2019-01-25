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
//import SpinnerTable from "../../common/SpinnerTable";
import isEmpty from "../../../validation/isEmpty";
import moment from "moment";

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
      employee: [],
      souv: "",
      oldItem: [null],
      newItem: [],
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
    if (newProps.getAllItem) {
      this.setState({
        formdata: newProps.tsouvenirTest,
        employee: newProps.employeeReducer.myEmployee,
        oldItem: newProps.getAllItem.map(element => {
          return {
            ...element,
            readOnly: true,
            disable: true,
            errorSouvenir: "",
            errorQty: ""
          };
        }),
        status: newProps.tsouvenirReducer.statusPUT,
        souvenirOptions: [{ label: "*Select Souvenir", value: "" }].concat(
          newProps.souvenirReducer.souvenirs.map(row => ({
            label: row.name,
            value: row.code
          }))
        )
      });
    }
  }

  handleOldItemChange = idx => evt => {
    // Clear Error State Message
    const errors = {};
    if (evt.target.name === "m_souvenir_id") {
      errors.errorSouvenir = "";
    }
    if (evt.target.name === "qty") {
      errors.errorQty = "";
    }

    const newOldItem = this.state.oldItem.map((oldItem, sidx) => {
      if (idx !== sidx) return oldItem;
      return { ...oldItem, ...errors, [evt.target.name]: evt.target.value };
    });

    this.setState({ oldItem: newOldItem });
  };

  handleEditOldItem = idx => () => {
    const oldItem = this.state.oldItem.map((oldItem, sidx) => {
      if (idx !== sidx) return oldItem;
      return {
        ...oldItem,
        disable: !oldItem.disable,
        readOnly: !oldItem.readOnly
      };
    });

    this.setState({ oldItem: oldItem });
  };

  handleRemoveOldItem = idx => () => {
    this.setState({
      oldItem: this.state.oldItem.filter((s, sidx) => idx !== sidx)
    });
  };

  handleAddNewItem = () => {
    this.setState({
      newItem: this.state.newItem.concat([
        {
          m_souvenir_id: "",
          qty: "",
          note: "",
          created_by: this.props.getAllItem[0].created_by,
          created_date: this.props.getAllItem[0].created_date,
          t_souvenir_id: this.props.getAllItem[0].t_souvenir_id,
          disable: true,
          readOnly: true,
          errorSouvenir: "",
          errorQty: ""
        }
      ])
    });
  };

  handleAddedItemChange = idx => evt => {
    // Clear Error State Message
    const errors = {};
    if (evt.target.name === "m_souvenir_id") {
      errors.errorSouvenir = "";
    }
    if (evt.target.name === "qty") {
      errors.errorQty = "";
    }

    const newAddedItem = this.state.newItem.map((newItem, sidx) => {
      if (idx !== sidx) return newItem;
      return { ...newItem, ...errors, [evt.target.name]: evt.target.value };
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
    if (e.target.name === "received_by") {
      this.setState({ errorReceivedBy: "" });
    }
    if (e.target.name === "received_date") {
      this.setState({ errorReceivedDate: "" });
    }

    // if (
    //   e.target.name === "received_date" &&
    //   moment(e.target.value) < moment().subtract(1, "day")
    // ) {
    //   this.setState({
    //     errorReceivedDate: "Received date must be after today"
    //   });
    // }

    let tmp = this.state.formdata;
    tmp[e.target.name] = e.target.value;
    this.setState({
      formdata: tmp
    });
  }

  validateDuplicateItem = input => {
    let duplicate = { status: false, index: null };
    input.forEach((content, i) => {
      input.forEach((element, index) => {
        if (element.m_souvenir_id === content.m_souvenir_id && i !== index)
          duplicate = {
            status: true,
            index: [index, i - this.state.oldItem.length]
          };
      });
    });
    return duplicate;
  };

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  closeModalEdit = () => {
    this.props.closeModalHandler();
    this.setState({
      newItem: []
    });
  };

  submitHandler() {
    if (isEmpty(this.state.formdata.received_by)) {
      this.setState({ errorReceivedBy: "This Field is Required" });
    }
    if (isEmpty(this.state.formdata.received_date)) {
      this.setState({ errorReceivedDate: "This Field is Required" });
    }
    // if (
    //   moment(this.state.formdata.received_date) <
    //   moment(this.props.tsouvenirTest.received_date)
    // ) {
    //   this.setState({ errorReceivedDate: "Received date must not older than the old one" });
    // }

    // Souvenir Item Form Validation
    // Set Error Counter
    let errorCounter = 0;
    this.state.newItem.forEach((item, idx) => {
      const newItems = this.state.newItem;
      const oldItems = this.state.oldItem;
      // Check for Empty Souvenir Name
      if (isEmpty(item.m_souvenir_id)) {
        errorCounter += 1;
        newItems[idx].errorSouvenir = "This Field is Required!";
        this.setState({ newItems });
      }
      // Check for Empty Qty
      if (isEmpty(item.qty)) {
        errorCounter += 1;
        newItems[idx].errorQty = "This Field is Required!";
        this.setState({ newItems });
      }
      // Check Duplicate Item
      let cekItems = this.state.oldItem.concat(this.state.newItem);
      if (this.validateDuplicateItem(cekItems).status === true) {
        let a = this.validateDuplicateItem(cekItems).index[0];
        let b = this.validateDuplicateItem(cekItems).index[1];
        errorCounter += 1;
        oldItems[a].errorSouvenir = "Can't Add Same Item Twice!";
        newItems[b].errorSouvenir = "Can't Add Same Item Twice!";
        this.setState({ oldItems, newItems });
      }
    });

    // Validate min one item to added
    if (this.state.oldItem.length === 0 && this.state.newItem.length === 0) {
      this.setState({
        alertData: {
          status: true,
          message: "Add minimal one item!"
        }
      });
      errorCounter += 1;
    }

    if (
      !isEmpty(this.state.formdata.received_by) &&
      !isEmpty(this.state.formdata.received_date) &&
      // !moment(this.state.received_date) < moment().subtract(1, "day") &&
      //this.state.item.length > 0 &&
      //duplicateItem === false &&
      errorCounter === 0
    ) {
      let newItem = this.state.newItem.map((content, index) => {
        return {
          m_souvenir_id: content.m_souvenir_id,
          qty: parseInt(content.qty),
          note: content.note,
          created_by: content.created_by,
          created_date: content.created_date,
          t_souvenir_id: content.t_souvenir_id,
          is_delete: false
        };
      });
      let data = {
        souv: this.state.formdata,
        oldItem: this.state.oldItem,
        newItem: newItem
      };
      //alert(JSON.stringify(data));
      this.props.updateTsouvenir(data, this.props.modalStatus);
      this.props.closeModalHandler();
      setTimeout(() => {
        this.setState({
          newItem: []
        });
      }, 2000);
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

    return (
      <Modal
        isOpen={this.props.edit}
        className={this.props.className}
        size="lg"
      >
        <ModalHeader>
          {" "}
          Edit Souvenir Stock - {this.state.formdata.code}
        </ModalHeader>
        <ModalBody>
          <form>
            {this.state.alertData.status === true && (
              <Alert color="danger">{this.state.alertData.message} </Alert>
            )}
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
              value={this.changeDateFormat(this.state.formdata.received_date)}
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
            {this.state.oldItem[0] === null ? (
              <tr className="text-center">
                <Spinner />
              </tr>
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
                          disabled={oldItem.disable}
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
                          readOnly={oldItem.readOnly}
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
                          readOnly={oldItem.readOnly}
                          placeholder="Note"
                        />
                      </td>
                      <td>
                        <Create
                          className="mr-1"
                          onClick={this.handleEditOldItem(idx)}
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
                          placeholder="*Souvenir Item"
                          className="form-control"
                          value={newItem.m_souvenir_id}
                          options={this.state.souvenirOptions}
                          onChange={this.handleAddedItemChange(idx)}
                          disabled={newItem.disable}
                          errors={newItem.errorSouvenir}
                        />
                      </td>
                      <td>
                        <TextField
                          type="number"
                          name="qty"
                          placeholder="*Qty"
                          className="form-control"
                          value={newItem.qty}
                          onChange={this.handleAddedItemChange(idx)}
                          readOnly={newItem.readOnly}
                          errors={newItem.errorQty}
                        />
                      </td>
                      <td>
                        <TextField
                          type="text"
                          name="note"
                          placeholder="Note"
                          className="form-control"
                          value={newItem.note}
                          onChange={this.handleAddedItemChange(idx)}
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
          <Button color="primary" onClick={this.submitHandler}>
            Update
          </Button>
          <Button color="warning" onClick={this.closeModalEdit}>
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
